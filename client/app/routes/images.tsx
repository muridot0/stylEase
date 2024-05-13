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
  async ({name, contentType, data, filename}) => {
    if(name !== 'file') return;

    if (contentType !== 'image/heic' && contentType !== 'image/heif') {
      //     const url = await fileToBase64(file)
      //     setFile(() => ({
      //       url: url,
      //       name: file.name,
      //       size: file.size
      //     }))

      //     setFileAttached(true)
      //     setFileSizeExceeded({ size: file.size, exceeded: false })
      //     setTimeout(() => {
      //       setLoading(false)
      //     }, 300)
      //   } else {
      //     const convert = await convertHEICtoJPEG(files[0])
      //     const newFile = new File(
      //       [convert as Blob],
      //       file.name.slice(0, file.name.indexOf('.')),
      //       { type: (convert as Blob).type }
      //     )
      //     if (newFile.size > maxFileSize) {
      //       setFileSizeExceeded({ size: newFile.size, exceeded: true })
      //       setFileAttached(false)
      //       setLoading(false)
      //       return
      //     }
      //     const url = await fileToBase64(newFile)
      //     setFile(() => ({
      //       url: url,
      //       name: newFile.name,
      //       size: newFile.size
      //     }))
      //     setFileAttached(true)
      //     setFileSizeExceeded({ size: newFile.size, exceeded: false })
      //     setLoading(false)
      //   }
  }
)
// const uploadFileHandler = unstable_composeUploadHandlers(
//   unstable_createFileUploadHandler({
//     file: ({ filename }) => mangle(filename)
//   }),
//   unstable_createMemoryUploadHandler()
// )

// Define the loader function
export let action: ActionFunction = async ({ request }) => {

  const data = request.body
  console.log(data)
    const formData = await unstable_parseMultipartFormData(
      request,
      uploadFileHandler
    )
    const imageBlob = formData.get('image') as File

    if (!imageBlob) return

    async function processImage(file: Blob) {
      const buffer = await file.arrayBuffer()
      const resized = await Jimp.read(Buffer.from(buffer)).then((img) => {
        return img.resize(256, Jimp.AUTO)
      })

      console.log(resized.inspect())
      const bufferSize = (await resized.getBufferAsync('image/jpeg')).length / 1_048_576
      const base64 = await resized.getBase64Async('image/jpeg')

      return {url: base64, size: bufferSize, width: resized.getWidth(), height: resized.getHeight()}
    }
    const processedImageData = await processImage(imageBlob)

    return json({...processedImageData, name: imageBlob.name })
}

function mangle(filename: string) {
  const rstr = randomStr(4)
  const timestamp = Date.now()

  const parts = filename.replace(/ /g, "_").split('.')
  const ext = parts.pop()
  return `${parts.join('.')}-${timestamp}_${rstr}.${ext}`
}
