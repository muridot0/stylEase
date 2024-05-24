function imageDataToBlob(imageData: ImageData): Promise<Blob> {
  return new Promise((resolve, reject) => {
      // Create a canvas element
      console.log(imageData.width, imageData.height)
      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;

      // Get the canvas context
      const ctx = canvas.getContext('2d');
      if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
      }

      // Put the ImageData onto the canvas
      ctx.putImageData(imageData, 0, 0);

      // Convert the canvas content to a blob
      canvas.toBlob((blob) => {
          if (blob) {
              resolve(blob);
          } else {
              reject(new Error('Conversion to blob failed'));
          }
      }); // You can change the image format here
  });
}

const b64toBlob = (b64Data: string, sliceSize=512) => {
  const b64String = b64Data.split(',')[1]
  const contentType = b64Data.match(/^data:([^;]+);base64,/)
  console.log(contentType?.[1])
  console.log(b64String)
  const byteCharacters = atob(b64String);
  const byteArrays = [];

  for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    const slice = byteCharacters.slice(offset, offset + sliceSize);

    const byteNumbers = new Array(slice.length);
    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  const blob = new Blob(byteArrays, {type: contentType?.[1]});
  return blob;
}

export {imageDataToBlob, b64toBlob}