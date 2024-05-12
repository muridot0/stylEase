function base64ToImageData(base64String: string) {
  // Create ImageData
  if (!base64String) return

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  const img = new Image()
  img.src = base64String

  const width = img.width
  const height = img.height

  canvas.width = width
  canvas.height = height

  ctx?.drawImage(img, 0, 0)

  const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)

  return { imageData, width, height }
}

function scaleImageData(imageData: ImageData, scaleFactor: number) {
  // Create a temporary canvas
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const img = new Image()
  img.src = imageDataToBase64(imageData)

  // Calculate the new dimensions
  const newWidth = 256;
  const newHeight = 256;

  // Set the canvas dimensions to the new size
  canvas.width = newWidth;
  canvas.height = newHeight;

  // Draw the original image onto the canvas, scaling it down
  ctx?.drawImage(img, 0, 0, newWidth, newHeight);

  // Get the scaled image data from the canvas
  const scaledImageData = ctx?.getImageData(0, 0, newWidth, newHeight);

  return scaledImageData;
}

function imageDataToBase64(imageData: ImageData) {
  var canvas = document.createElement('canvas');
  var ctx = canvas.getContext('2d');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx?.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

export {base64ToImageData, scaleImageData, imageDataToBase64}