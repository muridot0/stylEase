import React, { ReactHTMLElement } from 'react'
import clsx from 'clsx'
import convertHEICtoJPEG from '../lib/convertHEIC'

const DEFAULT_FILE_SIZE_IN_BYTES = 500000

interface Props {
  className?: string
  attachmentType?: 'preview'
  label: string
  maxFileSize?: number
}

function Attachment({
  label,
  attachmentType,
  maxFileSize = DEFAULT_FILE_SIZE_IN_BYTES,
  className
}: Props) {
  // TODO: add attachment storage and processing functionality
  const fileRef = React.useRef(null)
  const [fileAttached, setFileAttached] = React.useState(false)
  const [file, setFile] = React.useState<File | null>(null)

  const handleFileAttached = async (e: React.FormEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget
    if (!files) return
    if(files[0].type === 'image/heic'){
      // console.log('i am the convert', convertHEICtoJPEG(files[0]))
      const convert = await convertHEICtoJPEG(files[0]).then((res) => console.log(res) );
      console.log(convert)
      // setFile(convertHEICtoJPEG(files[0]))
      console.log(files[0])
    }
    setFile(files[0])
    console.log(file)
    setFileAttached(true)
  }

  const renderUploadJSX = () => {
    return (
      <>
        <label id='uploadLabel' htmlFor='image' className='hidden'>
          {label}
        </label>
        <input
          id='image'
          type='file'
          name='image'
          ref={fileRef}
          accept='.jpg,.png,.jpeg,.heif,.heic'
          className='opacity-0 block w-full absolute top-0 right-0 left-0 bottom-0 z-1 cursor-pointer'
          onChange={handleFileAttached}
        />
        <div className='flex flex-col items-center gap-1'>
          <span className='i-lucide-file-up flex text-[45px] text-[--node-icons-color]'></span>
          <p>Upload file</p>
        </div>
      </>
    )
  }

  const renderPreviewJSX = () => {
    return (
      <div>
        <img src={URL.createObjectURL(file!)} alt='' />
      </div>
    )
  }

  const renderFileAttached = () => {

    return (
      <div>
        <img src={URL.createObjectURL(file!)} alt='' />
      </div>
    )
  }

  const renderNoFileAttachedJSX = () => {
    return (
      <div className='flex flex-col items-center gap-1 nodrag cursor-default'>
        <span className='i-lucide-image-off flex text-[45px] text-[--node-icons-color]'></span>
        <p>No preview available</p>
      </div>
    )
  }

  return (
    <section
      className={clsx(
        className,
        'border-[--node-border-color] border text-center p-[1.75rem] rounded-[4px] relative max-w-[200px]'
      )}
    >
      {attachmentType === 'preview' && fileAttached
        ? renderPreviewJSX()
        : attachmentType === 'preview' && !fileAttached
          ? renderNoFileAttachedJSX()
          : fileAttached
            ? renderFileAttached()
            : renderUploadJSX()}
    </section>
  )
}

export default Attachment
