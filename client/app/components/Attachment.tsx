import React from 'react'
import clsx from 'clsx'
import convertHEICtoJPEG from '../lib/convertHEIC'
import { convertBytestoMegabytes } from '../lib/bytesToMegabytes'
import { Node, ReactFlowInstance, ReactFlowJsonObject, useReactFlow } from 'reactflow'
import { CustomNode } from '~/state/nodesState'

const DEFAULT_FILE_SIZE_IN_BYTES = 500000

interface Props {
  className?: string
  attachmentType?: 'preview'
  label: string
  /**
   * maximum allowed file size in bytes
   */
  maxFileSize?: number
  nodeId: string
}

function Attachment({
  label,
  attachmentType,
  maxFileSize = DEFAULT_FILE_SIZE_IN_BYTES,
  className,
  nodeId
}: Props) {
  // TODO: add attachment storage functionality
  const fileRef = React.useRef(null)
  const [fileAttached, setFileAttached] = React.useState(false)
  const [file, setFile] = React.useState<{url: string, name: string, size: number} | null>(null)
  const [fileSizeExceeded, setFileSizeExceeded] = React.useState<{
    size: number
    exceeded: boolean
  }>()
  const [loading, setLoading] = React.useState(false)

  const reactflow = useReactFlow()

  React.useEffect(() => {
    reactflow.setNodes((nodes) =>
      nodes.map((node) => {
        if(node.id === nodeId) {
          console.log(file)
          node.data = {
            ...node.data,
            content: {...file}
          }
        }
        return node
      })
    )
  }, [file])

  React.useEffect(() => {
    const flowData = localStorage.getItem('stylEase')

    if(!flowData) return

    const parsedFlow: ReactFlowJsonObject = JSON.parse(flowData)

    const {nodes} = parsedFlow

    nodes.map((node): void => {
      if(node.id === nodeId) {
        if(JSON.stringify(node.data.content) !== '{}'){
          setFile(() => ({
            ...node.data.content
          }))
          setFileAttached(true)
        }
      }
    })


    return () => {
      if(file)
      URL.revokeObjectURL(file.url)
    }
  }, [])

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
        setFile(() => ({
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size
        }))
        setFileAttached(true)
        setFileSizeExceeded({ size: file.size, exceeded: false })
        setTimeout(() => {
          setLoading(false)
        }, 300)
      } else {
        const convert = await convertHEICtoJPEG(files[0])
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
        setFile(() => ({
          url: URL.createObjectURL(newFile),
          name: newFile.name,
          size: newFile.size
        }))
        setFileAttached(true)
        setFileSizeExceeded({ size: newFile.size, exceeded: false })
        setLoading(false)
      }
    }
  }

  const handleFileDelete = () => {
    // reactflow.setNodes((nodes) =>
    //   nodes.map((node) => {
    //     if(node.id === nodeId && file !== null) {
    //       console.log(file)
    //       node.data = {
    //         ...node.data,
    //         content: {...file}
    //       }
    //     }
    //     return node
    //   })
    // )
    setFile(null)
    setFileAttached(false)
    console.log('the file here', file)
  }

  const renderUploadJSX = () => {
    return (
      <div>
        {loading ? (
          <div className='h-20 flex justify-center items-center flex-col'>
            <span className='i-lucide-cog animate-spin text-[45px]'></span>
            <p className='text-md'>Processing your picture ...</p>
          </div>
        ) : !loading && fileAttached ? (
          renderFileAttached()
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
            <img src={file.url} alt='' />
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
              src={file.url}
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
        { 'p-0 !border-none': fileAttached && !loading },
        { shake: fileSizeExceeded?.exceeded }
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
