import React from 'react'
import clsx from 'clsx'
import { niceBytes } from '../lib/niceBytes'
import { useReactFlow } from 'reactflow'
import globalNodeState from '~/state/nodesState'
import { imageDataToBase64 } from '~/lib/imageDataToBase64'

interface Props {
  className?: string
  nodeId: string
}

export default function Preview({ className, nodeId }: Props) {
  const [loading, setLoading] = React.useState(false)
  const [previewGenerated, setPreviewGenerated] = React.useState(false)
  const [isModalOpen, setIsModalOpen] = React.useState(false)
  const [file, setFile] = React.useState<{
    url: string | ImageData
    name: string
    size: number
    height: number
    width: number
  } | null>(null)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const previewRef = React.useRef<HTMLImageElement>(null)
  const dialogRef = React.useRef<HTMLDialogElement>(null)

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dialogRef.current &&
        e.target === dialogRef.current
      ) {
        dialogRef.current.close()
        setIsModalOpen(false)
      }
    }
    document.addEventListener('click', handleClickOutside, true)

    return () => {
      document.removeEventListener('click', handleClickOutside, true)
    }
  }, [])

  React.useEffect(() => {
    if(!previewRef.current) return

    const data = file?.url

    if(!data) return

    if((data as ImageData).width > 1000) {
      previewRef.current.width = 600
    } else {
      const aspRatio = (data as ImageData).width / (data as ImageData).height
      previewRef.current.width = (data as ImageData).width * aspRatio
    }


    const src = imageDataToBase64(data as ImageData)

    previewRef.current.src = src
  }, [isModalOpen, file])

  React.useEffect(() => {
    globalNodeState.subscribe((nodes) => {
      const currentNode = nodes.find((node) => node.id === nodeId)
      if (!currentNode?.data.content) {
        setPreviewGenerated(false)
        setFile(null)
        setLoading(false)
        return
      }
      setFile(() => ({
        ...currentNode.data.content!
      }))
      setLoading(currentNode.data.stylEasing!)
      setPreviewGenerated(true)
    })
  }, [globalNodeState.value])

  React.useEffect(() => {
    globalNodeState.subscribe((val) => {
      val.map((node) => {
        if (node.id === nodeId) {
          setLoading(node.data.stylEasing!)
        }
      })
    })
  }, [globalNodeState.value])

  React.useEffect(() => {
    if (!file) {
      setPreviewGenerated(false)
      return
    }
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    const data = file?.url

    if (!data) return

    canvasRef.current.width = (data as ImageData).width
    canvasRef.current.height = (data as ImageData).height

    canvasRef.current.title = file.name

    ctx?.putImageData(data as ImageData, 0, 0)
  }, [file])

  const handleDownload = () => {}

  const handlePreview = () => {
    if (!dialogRef.current) return
    dialogRef.current.showModal()
    setIsModalOpen(true)
  }

  const renderPreviewJSX = () => {
    return (
      <div>
        <canvas
          aria-label={file?.name}
          ref={canvasRef}
          className='w-full rounded-[4px]'
        ></canvas>
        <div className='mt-2 mb-0 truncate ...'>{file?.name}</div>
        <aside className='flex items-center justify-between mt-auto cursor-default top-4 relative pb-3'>
          <p className='border font-medium rounded-md border-zinc-200 bg-zinc-100 text-zinc-800 dark:border-neutral-200 dark:bg-neutral-200 dark:text-neutral-800 px-1 text-sm'>
            {niceBytes(file!.size)}
          </p>
          <div className='flex gap-2'>
            <button
              className='bg-white border-1.5 border-[--node-border-color] dark:border-neutral-500 btn-shadow dark:bg-[--node-icons-color] rounded-full p-1.5 text-sm hover:brightness-95'
              onClick={handlePreview}
              title='Preview image'
            >
              <span className='i-lucide-fullscreen flex text-zinc-600 dark:text-zinc-200' />
              <span className='sr-only'>Preview image</span>
            </button>
            <button
              className=' bg-white border-1.5 border-[--node-border-color] dark:border-neutral-500 btn-shadow dark:bg-[--node-icons-color] rounded-full p-1.5 text-sm hover:brightness-95'
              onClick={handleDownload}
              title='Download image'
            >
              <span className='i-lucide-download flex text-zinc-600 dark:text-zinc-200' />
              <span className='sr-only'>Download image</span>
            </button>
          </div>
        </aside>
      </div>
    )
  }

  const renderNoFileAttachedJSX = () => {
    return (
      <>
        {loading && !previewGenerated ? (
          <div className='h-20 flex justify-center items-center flex-col'>
            <span className='i-lucide-cog animate-spin text-[45px]'></span>
            <p className='text-md'>
              Generating your <i className='font-bold'>stylEased</i> picture ...
            </p>
          </div>
        ) : (
          <div className='flex flex-col items-center gap-1 nodrag cursor-default'>
            <span className='i-lucide-image-off flex text-[45px] text-[--node-icons-color]' />
            <p>No preview available</p>
          </div>
        )}
      </>
    )
  }

  const showDialog = () => {
    return (
      <dialog
        ref={dialogRef}
        className='px-10 pt-6 pb-10 rounded-[8px] bg-[--modal-color] backdrop-blur-[--blur]'
      >
        <div className='justify-end flex'>
          <button
            className='flex'
            onClick={() => {
              dialogRef.current?.close()
            }}
          >
            <span className='i-lucide-circle-x text-3xl text-[--node-icons-color]'></span>
          </button>
        </div>
        <div className='flex justify-center items-center gap-2 mb-4 '>
          <span className='i-lucide-aperture text-2xl text-[--node-icons-color]'></span>
          <h1 className='text-2xl'>Preview Image</h1>
        </div>
        <div className=''>
          <img className='rounded-[4px]' ref={previewRef}></img>
        </div>
      </dialog>
    )
  }

  return (
    <section
      className={clsx(
        className,
        'border-[--node-border-color] border text-center p-[1.75rem] rounded-[4px] relative max-w-[200px]',
        { 'p-0 !border-none': previewGenerated }
      )}
    >
      {previewGenerated && file
        ? renderPreviewJSX()
        : renderNoFileAttachedJSX()}
      {showDialog()}
    </section>
  )
}
