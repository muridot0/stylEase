export default function base64ToImageData(base64String: string) {
  // Create ImageData
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  const img = new Image();
  img.src = base64String;

  const width = img.width;
  const height = img.height;

  canvas.width = width;
  canvas.height = height;

  ctx?.drawImage(img, 0, 0);

  const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);

  return {imageData, width, height};
}