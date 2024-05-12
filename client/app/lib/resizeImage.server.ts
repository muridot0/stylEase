import sharp from 'sharp';

// Function to resize an image
export const resizeImage = async (imageBuffer: Buffer) => {
  try {
    const resizedImageBuffer = await sharp(imageBuffer)
      .resize(256, 256) // Resize to 256x256 pixels
      .toBuffer();
    return resizedImageBuffer;
  } catch (error) {
    console.error('Error resizing image:', error);
    throw error;
  }
};