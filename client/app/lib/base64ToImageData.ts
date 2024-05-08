export default function base64ToImageData(base64String: string) {
  console.log(base64String)
  // Extract base64 data
  const base64Data = base64String.split(',')[1];

  // Decode base64 to binary data
  const binaryString = atob(base64Data);

  // Create a Uint8ClampedArray to hold the binary data
  const byteArray = new Uint8ClampedArray(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
      byteArray[i] = binaryString.charCodeAt(i);
  }

  console.log(byteArray)

  // Create ImageData
  const imageData = new ImageData(byteArray, 1, 1);

  return imageData;
}