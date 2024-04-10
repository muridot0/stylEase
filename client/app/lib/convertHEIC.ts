// TODO: finish handling HEIC file conversion

function isHEIC(file: File) {
  console.log(file)
  const fileType = file.type ? file.type.split('image/').pop() : file.name.split('.').pop()?.toLowerCase();
  console.log()
  return fileType === 'heic' || fileType === 'heif'
}

export default async function convertHEICtoJPEG(file: File): Promise<File | undefined> {
    if(!isHEIC(file)) return Promise.resolve(file)
    const heic2any = import('heic2any')
    heic2any.then(async (heic2any) => await heic2any.default({blob: file, toType: "image/jpeg"})).then((convertedFile) => {
      console.log('file', convertedFile)
      return convertedFile
    }).catch(e => {
      console.log('there was an error converting file to jpeg', e)
    })
}