import sharp from 'sharp';

// Function to resize an image
export const resizeImage = async (imageBuffer: Buffer) => {
  try {
    let data, width, height, size
    await sharp(imageBuffer)
      .resize(256) // Resize to 256x256 pixels
      .toBuffer((err, data, info) => {
        if (err) {
          console.error('There was an error: ', err)
          return
        }
        data = data;
        width = info.width;
        height = info.height;
        size = info.size;
      });
      return {data, width, height, size}
    // return resizedImageBuffer;
  } catch (error) {
    console.error('Error resizing image:', error);
    throw error;
  }
};