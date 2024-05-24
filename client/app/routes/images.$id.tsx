import {
  ActionFunction,
  json,
  unstable_composeUploadHandlers,
  unstable_parseMultipartFormData
} from '@remix-run/node'
import Jimp from 'jimp'
import randomStr from '~/lib/randomStr'
import convert from 'heic-convert'

const convertToBuffer = async (data: AsyncIterable<Uint8Array>) => {
  const dataArray = []
  for await (const x of data) {
    dataArray.push(x)
  }
  return Buffer.concat(dataArray)
}

const uploadFileHandler = unstable_composeUploadHandlers(
  async ({ name, contentType, data, filename }) => {
    if (name !== 'image') return

    if (contentType !== 'image/heic' && contentType !== 'image/heif') {
      return JSON.stringify({
        url: await convertToBuffer(data),
        filename: mangle(filename || `stylEase_${randomStr(2)}`)
      })
    }

    const convertedFile = await convert({
      buffer: await convertToBuffer(data), // the HEIC file buffer
      format: 'JPEG',
      quality: 1
    })

    return JSON.stringify({
      url: convertedFile,
      filename: mangle(filename || `stylEase_${randomStr(2)}`)
    })
  }
)

// Define the loader function
export const action: ActionFunction = async ({ request }) => {
  if (request.method === 'GET') {
    return null
  }

  const formData = await unstable_parseMultipartFormData(
    request,
    uploadFileHandler
  )

  const imageBlob = JSON.parse(formData.get('image') as string)
  const requestId = request.url.split('images/')[1]

  if (!imageBlob) return

  async function processImage(file: Buffer) {
    const resized = await Jimp.read(Buffer.from(file)).then((img) => {
      if (requestId.includes('style-node')) {
        return img.resize(256, Jimp.AUTO)
      } else if (img.getWidth() <= 1024) {
        return img
      } else {
        return img.resize(1024, Jimp.AUTO)
      }
    })

    const bufferSize = (
      await resized.getBufferAsync(Jimp.AUTO as unknown as string)
    ).length
    const base64 = await resized.getBase64Async(Jimp.AUTO)

    resized.getMIME()

    return {
      url: base64,
      size: bufferSize,
      width: resized.getWidth(),
      height: resized.getHeight(),
      mime: resized.getMIME()
    }
  }
  const processedImageData = await processImage(imageBlob.url)

  return json({ ...processedImageData, name: imageBlob.filename, mime: processedImageData.mime})
}

function mangle(filename: string) {
  const rstr = randomStr(4)
  const timestamp = Date.now()

  const parts = filename.replace(/ /g, '_').split('.')
  const ext = parts.pop()
  if (ext?.toLowerCase() !== 'heic' && ext?.toLowerCase() !== 'heif') {
    return `${parts.join('.')}-${timestamp}_${rstr}.${ext}`
  }
  return `${parts.join('.')}-${timestamp}_${rstr}.jpg`
}
