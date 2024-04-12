import React from 'react'
import clsx from 'clsx'
import convertHEICtoJPEG from '../lib/convertHEIC'
import { convertBytestoMegabytes } from '../lib/bytesToMegabytes'

const DEFAULT_FILE_SIZE_IN_BYTES = 500000

interface Props {
  className?: string
  attachmentType?: 'preview'
  label: string
  /**
   * maximum allowed file size in bytes
   */
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
  const [fileSizeExceeded, setFileSizeExceeded] = React.useState<{
    size: number
    exceeded: boolean
  }>()
  const [loading, setLoading] = React.useState(false)

  const handleFileAttached = async (e: React.FormEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget
    setLoading(true)

    if (!files) {
      setLoading(false)
      return
    }

    for (const file of files) {
      setFileSizeExceeded({ size: file.size, exceeded: false })
      if (file.size > maxFileSize) {
        setFileSizeExceeded({ size: file.size, exceeded: true })
        setFileAttached(false)
        setLoading(false)
        return
      }

      if (file.type !== 'image/heic' && file.type !== 'image/heif') {
        setFile(file)
        setFileAttached(true)
        setFileSizeExceeded({ size: file.size, exceeded: false })
        setLoading(false)
      } else {
        const convert = await convertHEICtoJPEG(files[0])
        console.log(convert)
        const newFile = new File(
          [convert as Blob],
          file.name.slice(0, file.name.indexOf('.')),
          { type: (convert as Blob).type }
        )
        if (newFile.size > maxFileSize) {
          setFileSizeExceeded({ size: newFile.size, exceeded: true })
          setFileAttached(false)
          setLoading(false)
          return
        }
        setFile(newFile)
        setFileAttached(true)
        setFileSizeExceeded({ size: file.size, exceeded: false })
        setLoading(false)
      }
    }
  }

  const handleFileDelete = () => {
    setFile(null)
    setFileAttached(false)
  }

  const renderUploadJSX = () => {
    return (
      <div>
        {loading ? (
          <div className='h-20 flex justify-center items-center flex-col'>
            <span className='i-lucide-cog animate-spin text-[45px]'></span>
            <p className='text-md'>Processing your picture ...</p>
          </div>
        ) : (
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
            <div
              className={clsx('flex flex-col items-center gap-1', {
                'text-red-600 dark:text-red-600': fileSizeExceeded?.exceeded
              })}
            >
              <span
                className={clsx('i-lucide-file-up flex text-[45px]', {
                  'text-[--node-icons-color]': !fileSizeExceeded?.exceeded
                })}
              ></span>
              {!fileSizeExceeded?.exceeded ? (
                <p>Upload a picture</p>
              ) : (
                <>
                  <p className='font-medium'>
                    The file size of{' '}
                    {convertBytestoMegabytes(fileSizeExceeded.size)}mb is too
                    powerful!
                  </p>
                  <p className='text-sm font-italic'>
                    (File size limit {convertBytestoMegabytes(maxFileSize)}mb)
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </div>
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
            <aside className='flex items-center justify-between mt-auto cursor-default top-4 relative pb-3'>
              <p className='border font-medium rounded-md border-zinc-200 bg-zinc-100 text-zinc-800 dark:border-neutral-200 dark:bg-neutral-200 dark:text-neutral-800 px-1 text-sm'>
                {convertBytestoMegabytes(file.size)}mb
              </p>
              <button
                className=' bg-zinc-200 dark:bg-[--node-icons-color] rounded-full p-1 text-sm'
                onClick={handleFileDelete}
              >
                <span className='i-lucide-trash-2 flex text-zinc-600 dark:text-zinc-200'></span>
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
        { 'p-0 !border-none': fileAttached },
        { shake: fileSizeExceeded?.exceeded }
      )}
    >
      {attachmentType === 'preview' && fileAttached && !loading
        ? renderPreviewJSX()
        : attachmentType === 'preview' && !fileAttached && !loading
          ? renderNoFileAttachedJSX()
          : fileAttached
            ? renderFileAttached()
            : renderUploadJSX()}
    </section>
  )
}

export default Attachment
