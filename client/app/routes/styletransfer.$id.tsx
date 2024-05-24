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

  return null
}
