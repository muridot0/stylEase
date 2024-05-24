import { ActionFunction, unstable_composeUploadHandlers, unstable_parseMultipartFormData } from '@remix-run/node'
import * as tf from '@tensorflow/tfjs-node'
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
    if (name === 'style-ratio' || name === 'display-name') {
      const buffer = await convertToBuffer(data);
      return buffer.toString('utf-8'); // Assuming style-ratio is a string
    }
    const uint8Array = new Uint8Array(await convertToBuffer(data))

    return JSON.stringify({
      tensor: tf.node.decodeImage(uint8Array),
      filename: filename || `stylEase_${randomStr(2)}`,
      contentType
    })
  }
)



export const action: ActionFunction = async ({ request }) => {
  const formData = await unstable_parseMultipartFormData(request, uploadFileHandler)
  const entries = Object.fromEntries(formData)
  console.log(entries)

  // async function startStyling() {
  //   await tf.nextFrame();
  //   await tf.nextFrame();
  //   let bottleneck = await tf.tidy(() => {
  //     return styleNet.predict(tf.browser.fromPixels(this.styleImg).toFloat().div(tf.scalar(255)).expandDims());
  //   })
  //   if (this.styleRatio !== 1.0) {
  //     this.styleButton.textContent = 'Generating 100D identity style representation';
  //     await tf.nextFrame();
  //     const identityBottleneck = await tf.tidy(() => {
  //       return this.styleNet.predict(tf.browser.fromPixels(this.contentImg).toFloat().div(tf.scalar(255)).expandDims());
  //     })
  //     const styleBottleneck = bottleneck;
  //     bottleneck = await tf.tidy(() => {
  //       const styleBottleneckScaled = styleBottleneck.mul(tf.scalar(this.styleRatio));
  //       const identityBottleneckScaled = identityBottleneck.mul(tf.scalar(1.0-this.styleRatio));
  //       return styleBottleneckScaled.addStrict(identityBottleneckScaled)
  //     })
  //     styleBottleneck.dispose();
  //     identityBottleneck.dispose();
  //   }
  //   this.styleButton.textContent = 'Stylizing image...';
  //   await tf.nextFrame();
  //   const stylized = await tf.tidy(() => {
  //     return this.transformNet.predict([tf.browser.fromPixels(this.contentImg).toFloat().div(tf.scalar(255)).expandDims(), bottleneck]).squeeze();
  //   })
  //   await tf.browser.toPixels(stylized, this.stylized);
  //   bottleneck.dispose();  // Might wanna keep this around
  //   stylized.dispose();
  // }

  return null
}
