import React from 'react'
import clsx from 'clsx'
import convertHEICtoJPEG from '../lib/convertHEIC'
import { convertBytestoMegabytes } from '../lib/bytesToMegabytes'
import { ReactFlowJsonObject, useReactFlow } from 'reactflow'
import fileToBase64 from '~/lib/fileToBase64'
import base64ToImageData from '~/lib/base64ToImageData'
import setRef from '~/lib/setRef'

const DEFAULT_FILE_SIZE_IN_BYTES = 500000

interface Props {
  className?: string
  label: string
  nodeId: string
}

export default React.forwardRef(function Preview(
  { label, className, nodeId }: Props,
  ref: React.ForwardedRef<HTMLCanvasElement>
) {
  //TODO: chage this whole object to just be a file and handle accordingly
  const [loading, setLoading] = React.useState(false)
  const [previewGenerated, setPreviewGenerated] = React.useState(true)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  const reactflow = useReactFlow()

  React.useEffect(() => {
    if (!canvasRef.current) return
    setRef(ref, canvasRef.current)
  }, [])

  const renderPreviewJSX = () => {
    //TODO: complete functionality for displaynode here
    return (
      <div>
        <canvas ref={canvasRef} className='w-full rounded-[4px]'></canvas>
        <div className='mt-2 mb-0'>stylEased_Vincent_van_Gogh.jpg</div>
        <aside className='flex items-center justify-between mt-auto cursor-default top-4 relative pb-3'>
              <p className='border font-medium rounded-md border-zinc-200 bg-zinc-100 text-zinc-800 dark:border-neutral-200 dark:bg-neutral-200 dark:text-neutral-800 px-1 text-sm'>
                {/* {convertBytestoMegabytes(file.size)}mb */} 1mb
              </p>
              <button
                className=' bg-zinc-200 dark:bg-[--node-icons-color] rounded-full p-1 text-sm'
              >
                <span className='i-lucide-download flex text-zinc-600 dark:text-zinc-200'></span>
              </button>
            </aside>
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
        { 'p-0 !border-none': previewGenerated }
      )}
    >
      {previewGenerated ? renderPreviewJSX() : renderNoFileAttachedJSX()}
    </section>
  )
})
