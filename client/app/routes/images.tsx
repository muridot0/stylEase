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

// Define the loader function
export let action: ActionFunction = async ({ request }) => {
  if(request.method === 'GET') {
    return null
  }
  const formData = await unstable_parseMultipartFormData(
    request,
    uploadFileHandler
  )

  const imageBlob = JSON.parse(formData.get('image') as string)

  if (!imageBlob) return

  async function processImage(file: Buffer) {
    console.log(file)
    const resized = await Jimp.read(Buffer.from(file)).then((img) => {
      return img.resize(256, Jimp.AUTO)
    })

    const bufferSize =
      (await resized.getBufferAsync(Jimp.MIME_JPEG)).length
    const base64 = await resized.getBase64Async(Jimp.MIME_JPEG)

    return {
      url: base64,
      size: bufferSize,
      width: resized.getWidth(),
      height: resized.getHeight()
    }
  }
  const processedImageData = await processImage(imageBlob.url)

  return json({ ...processedImageData, name: imageBlob.filename })
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
