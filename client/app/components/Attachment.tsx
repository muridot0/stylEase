import React from 'react'
import clsx from 'clsx'

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
          className='opacity-0 block w-full absolute top-0 right-0 left-0 bottom-0 z-1 cursor-pointer'
        />
        <div className='flex flex-col items-center gap-1'>
          <span className='i-lucide-file-up flex text-[45px] text-[--node-icons-color]'></span>
          <p>Upload file</p>
        </div>
      </>
    )
  }

  const renderPreviewJSX = () => {
    return <div>I am Preview</div>
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
        'border-[--node-border-color] border text-center p-[1.75rem] rounded-[4px] relative'
      )}
    >
      {attachmentType === 'preview' && fileAttached
        ? renderPreviewJSX()
        : attachmentType === 'preview' && !fileAttached
          ? renderNoFileAttachedJSX()
          : renderUploadJSX()}
    </section>
  )
}

export default Attachment
