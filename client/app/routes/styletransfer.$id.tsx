import { ActionFunction, unstable_composeUploadHandlers, unstable_parseMultipartFormData } from '@remix-run/node'
import * as tf from '@tensorflow/tfjs-node'
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
    if (name === 'style-ratio' || name === 'display-name') {
      const buffer = await convertToBuffer(data);
      return buffer.toString('utf-8'); // Assuming style-ratio is a string
    }
    const uint8Array = new Uint8Array(await convertToBuffer(data))

    return JSON.stringify({
      tensor: tf.node.decodeImage(uint8Array).toFloat().div(tf.scalar(255)).expandDims()
      // filename: filename || `stylEase_${randomStr(2)}`,
      // contentType
    })
  }
)

const styleNet = await tf.loadGraphModel(
  'file://app/data/transfer-model-data/saved_model_style_js/model.json');


export const action: ActionFunction = async ({ request }) => {
  const formData = await unstable_parseMultipartFormData(request, uploadFileHandler)
  const entries = Object.fromEntries(formData)
  // console.log(entries)

  const styleImg = JSON.parse(formData.get('style-image') as string) as tf.Tensor
  const contentImg = JSON.parse(formData.get('content-image') as string) as tf.Tensor
  const styleRatio = parseFloat(JSON.parse(formData.get('style-ratio') as string))

  console.log(styleImg, styleRatio)

  async function startStyling() {
    let bottleneck = tf.tidy(() => {
      return styleNet.predict(styleImg) as tf.Tensor;
    })
    if (styleRatio !== 1.0) {
      const identityBottleneck = tf.tidy(() => {
        return styleNet.predict(contentImg) as tf.Tensor;
      })
      const styleBottleneck = bottleneck;
      bottleneck = await tf.tidy(() => {
        const styleBottleneckScaled = styleBottleneck.mul(tf.scalar(styleRatio));
        const identityBottleneckScaled = identityBottleneck.mul(tf.scalar(1.0-styleRatio));
        return styleBottleneckScaled.addStrict(identityBottleneckScaled)
      })
      styleBottleneck.dispose();
      identityBottleneck.dispose();
    }
    // this.styleButton.textContent = 'Stylizing image...';
    // await tf.nextFrame();
    // const stylized = await tf.tidy(() => {
    //   return this.transformNet.predict([tf.browser.fromPixels(this.contentImg).toFloat().div(tf.scalar(255)).expandDims(), bottleneck]).squeeze();
    // })
    // await tf.browser.toPixels(stylized, this.stylized);
    // bottleneck.dispose();  // Might wanna keep this around
    // stylized.dispose();
  }

  return null
}
