function isHEIC(file: File) {
  const fileType = file.type
    ? file.type.split('image/').pop()
    : file.name.split('.').pop()?.toLowerCase()
  return fileType === 'heic' || fileType === 'heif'
}

export default async function convertHEICtoJPEG(file: File) {
  if (!isHEIC(file)) return Promise.resolve(file)
  const heic2any = await import('heic2any')
  return await Promise.resolve(
    heic2any.default({ blob: file, toType: 'image/jpeg' }).catch((e) => {
      console.error('there was an error converting your file', e)
    })
  )
}

