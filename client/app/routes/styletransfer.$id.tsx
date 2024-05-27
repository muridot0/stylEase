import {
  ActionFunction,
  unstable_composeUploadHandlers,
  unstable_parseMultipartFormData
} from '@remix-run/node'
import * as tf from '@tensorflow/tfjs-node'
import Jimp from 'jimp'
import randomStr from '~/lib/randomStr'

const convertToBuffer = async (data: AsyncIterable<Uint8Array>) => {
  const dataArray = []
  for await (const x of data) {
    dataArray.push(x)
  }
  return Buffer.concat(dataArray)
}

const uploadFileHandler = unstable_composeUploadHandlers(
  async ({ name, contentType, data, filename }) => {
    if (
      name === 'style-ratio' ||
      name === 'display-name' ||
      name === 'content-sizes'
    ) {
      const buffer = await convertToBuffer(data)
      return buffer.toString('utf-8')
    }
    const uint8Array = new Uint8Array(await convertToBuffer(data))

    const tensor = tf.node.decodeImage(uint8Array)

    return JSON.stringify({ data: tensor.arraySync(), shape: tensor.shape })
  }
)

const styleNet = await tf.loadGraphModel(
  'file://app/data/transfer-model-data/saved_model_style_js/model.json'
)

const transformNet = await tf.loadGraphModel(
  'file://app/data/transfer-model-data/saved_model_transformer_js/model.json'
)

export const action: ActionFunction = async ({ request }) => {
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadFileHandler
  )

  const styleImg = JSON.parse(formData.get('style-image') as string)
  const contentImg = JSON.parse(formData.get('content-image') as string)
  const styleRatio = parseFloat(
    JSON.parse(formData.get('style-ratio') as string)
  )
  const displayName = formData.get('display-name') as string

  async function startStyling() {
    function predictStyleParameters(style: []): tf.Tensor4D {
      return tf.tidy(() => {
        return styleNet.predict(
          tf.tensor3d(style).toFloat().div(tf.scalar(255)).expandDims()
        )
      }) as tf.Tensor4D
    }

    function produceStylized(
      content: [],
      bottleneck: tf.Tensor4D
    ): tf.Tensor3D {
      return tf.tidy(() => {
        const image: tf.Tensor4D = transformNet.predict([
          tf.tensor3d(content).toFloat().div(tf.scalar(255)).expandDims(),
          bottleneck
        ]) as tf.Tensor4D
        return image.squeeze()
      })
    }

    let styleRepresentation = predictStyleParameters(styleImg['data'])
    if (styleRatio !== undefined) {
      styleRepresentation = styleRepresentation
        .mul(tf.scalar(styleRatio))
        .add(
          predictStyleParameters(contentImg['data']).mul(
            tf.scalar(1.0 - styleRatio)
          )
        )
    }
    const stylized = produceStylized(contentImg['data'], styleRepresentation)
    const res = await tf.browser.toPixels(stylized)
    styleRepresentation.dispose()
    stylized.dispose()

    return {
      url: Array.from(res),
      size: Buffer.from(res).byteLength,
      width: stylized.shape[1],
      height: stylized.shape[0],
      mime: Jimp.MIME_JPEG,
      name: displayName
    }
  }

  return await startStyling()
}
