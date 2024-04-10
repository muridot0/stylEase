import React from 'react'
import clsx from 'clsx'
import convertHEICtoJPEG from '../lib/convertHEIC'
import { convertBytestoMegabytes } from '../lib/bytesToMegabytes'

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

  // TODO: restrict file attachements of size greater than 3mb and add a nice error message (maybe with some animations to make the whole node shake)
  const handleFileAttached = async (e: React.FormEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget
    if (!files) return
    if (files[0].type === 'image/heic') {
      const convert = await convertHEICtoJPEG(files[0])
      console.log(convert)
      const newFile = new File(
        [convert as Blob],
        files[0].name.slice(0, files[0].name.indexOf('.')),
        { type: (convert as Blob).type }
      )
      setFile(newFile)
      setFileAttached(true)
      return
    }
    setFile(files[0])
    console.log(file)
    setFileAttached(true)
  }

  const handleFileDelete = () => {
    setFile(null)
    setFileAttached(false)
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
        {file && (
          <>
            <img src={URL.createObjectURL(file)} alt='' />
            {/* <span>{convertBytestoMegabytes(file.size)}</span> */}
            <span className='i-lucide-trash-2'></span>
          </>
        )}
      </div>
    )
  }

  const renderFileAttached = () => {
    return (
      <div>
        {file && (
          <>
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className='max-w-[100%] rounded-[4px]'
            />
            <aside className='flex items-center justify-between mt-auto cursor-default top-4 relative'>
              <p>{convertBytestoMegabytes(file.size)}mb</p>
              <button className='border border-[--node-icons-color] bg-[--node-handle-color] rounded-full p-1' onClick={handleFileDelete}>
                <span className='i-lucide-trash-2 flex text-[--node-bg-color]'></span>
              </button>
            </aside>
          </>
        )}
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
        'border-[--node-border-color] border text-center p-[1.75rem] rounded-[4px] relative max-w-[200px]',
        { 'p-0 !border-none': fileAttached }
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
