export const ImageDataToBlob = function(imageData: ImageData): Promise<Blob>{
  let w = imageData.width;
  let h = imageData.height;
  let canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  let ctx = canvas.getContext("2d");
  ctx?.putImageData(imageData, 0, 0);        // synchronous

  return new Promise((resolve) => {
    canvas.toBlob((blob) => {return blob}); // implied image/png format
  });
}