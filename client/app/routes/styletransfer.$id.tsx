import { ActionFunction, unstable_composeUploadHandlers, unstable_parseMultipartFormData } from '@remix-run/node'
import * as tf from '@tensorflow/tfjs-node'
import Jimp from 'jimp'
import randomStr from '~/lib/randomStr'

//TODO: add reiinako's style transfer logic
const convertToBuffer = async (data: AsyncIterable<Uint8Array>) => {
  const dataArray = []
  for await (const x of data) {
    dataArray.push(x)
  }
  return Buffer.concat(dataArray)
}

const uploadFileHandler = unstable_composeUploadHandlers(
  async ({ name, contentType, data, filename }) => {
    if (name === 'style-ratio' || name === 'display-name' || name === 'content-sizes') {
      const buffer = await convertToBuffer(data);
      return buffer.toString('utf-8'); // Assuming style-ratio is a string
    }
    const uint8Array = new Uint8Array(await convertToBuffer(data))

    const tensor = tf.node.decodeImage(uint8Array)
    console.log(tensor.dataSync(), tensor.shape)

      return JSON.stringify({data: tensor.arraySync(), shape: tensor.shape})
  }
)

const styleNet = await tf.loadGraphModel(
  'file://app/data/transfer-model-data/saved_model_style_js/model.json');

const transformNet = await tf.loadGraphModel('file://app/data/transfer-model-data/saved_model_transformer_js/model.json')

export const action: ActionFunction = async ({ request }) => {
  const formData = await unstable_parseMultipartFormData(request, uploadFileHandler)
  const entries = Object.fromEntries(formData)
  // console.log(entries)

  const styleImg = JSON.parse(formData.get('style-image') as string)
  const contentImg = JSON.parse(formData.get('content-image') as string)
  const styleRatio = parseFloat(JSON.parse(formData.get('style-ratio') as string))
  const displayName = formData.get('display-name') as string
  const contentSizes = JSON.parse(formData.get('content-sizes') as string)

  // const styleImg = tf.tensor(JSON.parse(entries['style-image']))
  // const contentImg = tf.tensor(JSON.parse(entries['content-image']))
  // const styleRatio = parseFloat(entries['style-ratio'])

  console.log( styleImg['data'], styleRatio)

  async function startStyling() {
    console.log('im here', tf.tensor3d(styleImg['data']) instanceof tf.Tensor)
    let bottleneck = styleNet.predict(tf.tensor3d(styleImg['data']).toFloat().div(tf.scalar(255)).expandDims()) as tf.Tensor;
    console.log(bottleneck)

    if (styleRatio !== 1.0) {
      const identityBottleneck = tf.tidy(() => {
        return styleNet.predict(tf.tensor3d(contentImg['data']).toFloat().div(tf.scalar(255)).expandDims()) as tf.Tensor;
      })
      const styleBottleneck = bottleneck;
      bottleneck = tf.tidy(() => {
        const styleBottleneckScaled = styleBottleneck.mul(tf.scalar(styleRatio));
        const identityBottleneckScaled = identityBottleneck.mul(tf.scalar(1.0-styleRatio));
        return styleBottleneckScaled.add(identityBottleneckScaled)
      })
      styleBottleneck.dispose();
      identityBottleneck.dispose();
    }
    const stylized =  tf.tidy(() => {
      return (transformNet.predict([tf.tensor3d(contentImg['data']).toFloat().div(tf.scalar(255)).expandDims(), bottleneck]) as tf.Tensor).squeeze();
    })
    const res = await tf.browser.toPixels(stylized as tf.Tensor3D);

    return {
      url: res,
      size: Buffer.from(res).byteLength,
      width: contentSizes['width'],
      height: contentSizes['height'],
      mime: Jimp.MIME_JPEG,
      name: displayName
    }

  }

  return await startStyling()
}
