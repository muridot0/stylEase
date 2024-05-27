const b64toBlob = (b64Data: string, sliceSize = 512) => {
  const b64String = b64Data.split(',')[1]
  const contentType = b64Data.match(/^data:([^;]+);base64,/)
  const byteCharacters = atob(b64String)
  const byteArrays = []

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize)

    const byteNumbers = new Array(slice.length)
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i)
    }

    const byteArray = new Uint8Array(byteNumbers)
    byteArrays.push(byteArray)
  }

  const blob = new Blob(byteArrays, { type: contentType?.[1] })
  return blob
}

export { b64toBlob }
