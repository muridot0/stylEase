// TODO: finish handling HEIC file conversion

function isHEIC(file: File) {
  console.log(file)
  const fileType = file.type
    ? file.type.split('image/').pop()
    : file.name.split('.').pop()?.toLowerCase()
  console.log()
  return fileType === 'heic' || fileType === 'heif'
}

export default async function convertHEICtoJPEG(file: File) {
  if (!isHEIC(file)) return Promise.resolve(file)
  const heic2any = await import('heic2any')
  return await Promise.resolve(
    heic2any.default({ blob: file, toType: 'image/jpeg' }).catch((e) => {
      console.log('there was an error converting your file', e)
    })
  )
}

function blobToImage(blob: Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export {blobToImage}
