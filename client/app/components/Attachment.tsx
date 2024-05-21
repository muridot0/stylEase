import React from 'react'
import clsx from 'clsx'
import { niceBytes } from '../lib/niceBytes'
import { ReactFlowJsonObject, useReactFlow } from 'reactflow'
import { useFetcher } from '@remix-run/react'
import { db } from '~/lib/db'

const DEFAULT_FILE_SIZE_IN_BYTES = 500000

interface FetcherData {
  url: string
  size: number
  width: number
  height: number
  name: string
}

interface Props {
  className?: string
  label: string
  maxFileSize?: number
  nodeId: string
  uploadMessage: string
}

export default function Attachment({
  label,
  maxFileSize = DEFAULT_FILE_SIZE_IN_BYTES,
  className,
  nodeId,
  uploadMessage
}: Props) {
  const fetcher = useFetcher()
  const fileRef = React.useRef(null)
  const [fileAttached, setFileAttached] = React.useState(false)
  const [file, setFile] = React.useState<{
    url: string | ImageData
    name: string
    size: number
    width: number
    height: number
  } | null>(null)
  const [fileSizeExceeded, setFileSizeExceeded] = React.useState<{
    size: number
    exceeded: boolean
  }>()
  const [loading, setLoading] = React.useState(false)
  const reactflow = useReactFlow()

  React.useEffect(() => {
    reactflow.setNodes((nodes) =>
      nodes.map((node) => {
        if (node.data.id === nodeId) {
          node.data = {
            ...node.data,
            content: { ...file }
          }
          if (JSON.stringify(file) === '{}') setFileAttached(false)
        }
        return node
      })
    )
  }, [file])

  const restoreImages = async () => {
    const flow = await db.flow.get(1)

    if(!flow) return

    flow.nodes.map((node): void => {
      if (node.data.id === nodeId) {
        if (JSON.stringify(node.data.content) !== '{}') {
          setFile(() => ({
            ...node.data.content!
          }))
          setFileAttached(true)
        }
      }
    })
  }

  React.useEffect(() => {
    restoreImages()
  }, [])

  React.useEffect(() => {
    const data = fetcher.data as FetcherData
    if (!data || fetcher.state !== 'idle') {
      return
    }
    setFile(() => ({
      ...data
    }))
    setLoading(false)
    setFileAttached(true)
    setFileSizeExceeded({ size: data.size, exceeded: false })
  }, [fetcher])

  const handleFileAttached = async (e: React.FormEvent<HTMLInputElement>) => {
    const { files } = e.currentTarget
    if (!files) {
      setLoading(false)
      return
    }
    if (files[0].size > maxFileSize) {
      setFileSizeExceeded({ size: files[0].size, exceeded: true })
      setFileAttached(false)
      setLoading(false)
      return
    }

    setLoading(true)
    setFile(null)
    setFileAttached(false)
    setFileSizeExceeded({ size: files[0].size, exceeded: false })
    fetcher.submit(e.currentTarget.form, {
      action: `/images/${nodeId}`,
      method: 'post',
      encType: 'multipart/form-data'
    })
  }

  const handleFileDelete = () => {
    setFile(null)
    setFileAttached(false)
  }

  const renderUploadedPhoto = () => {
    return (
      <div>
        {loading ? (
          <div className='h-20 flex justify-center items-center flex-col'>
            <span className='i-lucide-cog animate-spin text-[45px]'></span>
            <p className='text-md'>Processing your picture ...</p>
          </div>
        ) : fileAttached && JSON.stringify(file) !== '{}' ? (
          renderFileAttached()
        ) : (
          <>
            <fetcher.Form
              action={`/images/${nodeId}`}
              method='post'
              encType='multipart/form-data'
            >
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
            </fetcher.Form>
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
                <p className='mt-4 w[10rem]'>{uploadMessage}</p>
              ) : (
                <>
                  <p className='font-medium'>
                    The file size of {niceBytes(fileSizeExceeded.size)} is too
                    powerful!
                  </p>
                  <p className='text-sm font-italic'>
                    (Try an image under {niceBytes(maxFileSize)})
                  </p>
                </>
              )}
            </div>
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
              src={file.url as string}
              width={256}
              height={256}
              alt={file.name}
              className='rounded-[4px]'
            />
            <div className='mt-2 mb-0 truncate ...'>{file.name}</div>
            <aside className='flex items-center justify-between mt-auto cursor-default top-4 relative pb-3'>
              <p className='border font-medium rounded-md border-zinc-200  bg-zinc-100 text-zinc-800 dark:border-neutral-200 dark:bg-neutral-200 dark:text-neutral-800 px-1 text-sm'>
                {niceBytes(file.size)}
              </p>
              <button
                className=' bg-white border-1.5 border-[--node-border-color] dark:border-neutral-500 btn-shadow dark:bg-[--node-icons-color] rounded-full p-1.5 text-sm hover:brightness-95'
                onClick={handleFileDelete}
              >
                <span className='i-lucide-trash-2 flex' />
                <span className='sr-only'>Delete image</span>
              </button>
            </aside>
          </>
        )}
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
      {renderUploadedPhoto()}
    </section>
  )
}
