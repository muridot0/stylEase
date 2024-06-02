function imageDataToBase64(imageData: ImageData) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = imageData.width
  canvas.height = imageData.height
  ctx?.putImageData(imageData, 0, 0)
  return canvas.toDataURL()
}

function imageDataToBlob(imageData: ImageData, callback: (blob: Blob | null) => void) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  canvas.width = imageData.width
  canvas.height = imageData.height
  ctx?.putImageData(imageData, 0, 0)
  return canvas.toBlob(callback)
}

export { imageDataToBase64, imageDataToBlob }
