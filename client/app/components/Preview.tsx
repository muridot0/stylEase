import React from 'react'
import clsx from 'clsx'
import { niceBytes } from '../lib/niceBytes'
import { useReactFlow, getIncomers } from 'reactflow'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '~/lib/db'
import globalNodeState from '~/state/nodesState'

interface Props {
  className?: string
  nodeId: string
}

export default function Preview({ className, nodeId }: Props) {
  //TODO: add code to toggle loading state while processing image
  const [loading, setLoading] = React.useState(false)
  const [previewGenerated, setPreviewGenerated] = React.useState(false)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const reactflow = useReactFlow()
  const [file, setFile] = React.useState<{
    url: string | ImageData
    name: string
    size: number
    height: number
    width: number
  } | null>(null)


  const incommers = getIncomers(
    reactflow.getNode(nodeId)!,
    reactflow.getNodes(),
    reactflow.getEdges()
  )



  React.useEffect(() => {
    globalNodeState.subscribe((nodes) => {
      const currentNode = nodes.find((node) => node.id === nodeId)
      if(!currentNode?.data.content) return
      setFile(() => ({
        ...currentNode.data.content!
      }))
      setPreviewGenerated(true)
    })
  }, [globalNodeState.value])

  React.useEffect(() => {
    if (!file) return
    if (!canvasRef.current) return
    const ctx = canvasRef.current.getContext('2d')
    //INFO: would receive ImageData from the model so only place to do conversion is for the model input
    const data = file.url

    if (!data) return

    canvasRef.current.width = (data as ImageData).width
    canvasRef.current.height = (data as ImageData).height

    ctx?.putImageData(data as ImageData, 0, 0)
  }, [file])

  const handleDownload = () => {}

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
          <button
            className=' bg-white border-1.5 border-[--node-border-color] dark:border-neutral-500 btn-shadow dark:bg-[--node-icons-color] rounded-full p-1.5 text-sm hover:brightness-95'
            onClick={handleDownload}
          >
            <span className='i-lucide-download flex text-zinc-600 dark:text-zinc-200' />
            <span className='sr-only'>Download image</span>
          </button>
        </aside>
      </div>
    )
  }

  const renderNoFileAttachedJSX = () => {
    // TODO: adding spinner to preview when stylization image is loading
    return (
      <>
        {loading && !previewGenerated ? (
          <div className='h-20 flex justify-center items-center flex-col'>
            <span className='i-lucide-cog animate-spin text-[45px]'></span>
            <p className='text-md'>Generating your stylEased picture ...</p>
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

  return (
    <section
      className={clsx(
        className,
        'border-[--node-border-color] border text-center p-[1.75rem] rounded-[4px] relative max-w-[200px]',
        { 'p-0 !border-none': previewGenerated }
      )}
    >
      {previewGenerated ? renderPreviewJSX() : renderNoFileAttachedJSX()}
    </section>
  )
}
