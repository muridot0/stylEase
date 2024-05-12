import {
  ActionFunction,
  json,
  unstable_composeUploadHandlers,
  unstable_createFileUploadHandler,
  unstable_createMemoryUploadHandler,
  unstable_parseMultipartFormData
} from '@remix-run/node'
import Jimp from 'jimp'
import randomStr from '~/lib/randomStr'

const uploadFileHandler = unstable_composeUploadHandlers(
  unstable_createFileUploadHandler({
    file: ({ filename }) => mangle(filename)
  }),
  unstable_createMemoryUploadHandler()
)

// Define the loader function
export let action: ActionFunction = async ({ request }) => {
  if (request.method === 'POST') {
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadFileHandler
    )
    console.log(formData.get('image'))
    const imageBlob = formData.get('image') as File

    if (!imageBlob) return

    async function processImage(file: Blob) {
      const buffer = await file.arrayBuffer()
      const resized = await Jimp.read(Buffer.from(buffer)).then((img) => {
        return img.resize(256, Jimp.AUTO)
      })

      console.log(resized.inspect())
      console.log(resized.getBuffer.length / 1_048_000)
      const base64 = await resized.getBase64Async('image/jpeg')

      // const arrayBuffer = await file.arrayBuffer()

      // const buffer = Buffer.from(arrayBuffer)
      // const imageData = await resizeImage(buffer)

      // console.log(imageData)

      // return imageData
      return base64
    }

    const processedImageData = await processImage(imageBlob)

    return json({ buffer: processedImageData})
  }

  return json('returned', { status: 200 })
}

function mangle(filename: string) {
  const rstr = randomStr(4)
  const timestamp = Date.now()

  const parts = filename.split('.')
  const ext = parts.pop()
  return `${parts.join('.')}-${timestamp}_${rstr}.${ext}`
}
