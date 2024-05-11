import React from 'react'
import clsx from 'clsx'
import { convertBytestoMegabytes } from '../lib/bytesToMegabytes'
import { useReactFlow, getIncomers } from 'reactflow'
import {base64ToImageData} from '~/lib/base64ToImageData'
import fetchFromIndexedDB from '~/lib/fetchFromIndexedDB'
import { useLiveQuery } from 'dexie-react-hooks'
import { db } from '~/lib/db'

interface Props {
  className?: string
  nodeId: string
}

export default React.forwardRef(function Preview(
  { className, nodeId }: Props,
  ref: React.ForwardedRef<HTMLCanvasElement>
) {
  //TODO: chage this whole object to just be a file and handle accordingly
  const [loading, setLoading] = React.useState(false)
  const [previewGenerated, setPreviewGenerated] = React.useState(false)
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const reactflow = useReactFlow()

  const incommers = getIncomers(reactflow.getNode(nodeId)!, reactflow.getNodes(), reactflow.getEdges())
  // const [file, setFile] = React.useState<{
  //   url: string
  //   name: string
  //   size: number
  // } | null>(null)

  const file = useLiveQuery(() => db.imagedata.where('id').equals(incommers[0].id).toArray())

  console.log(file)


  // React.useEffect(() => {

  //   request.onerror = function (event) {
  //     console.error('IndexedDB error:', (event.target as any).errorCode);
  //   };

  //   request.onsuccess = function (event) {
  //     const db = (event.target as any).result as IDBDatabase;

  //     const transaction = db.transaction(['stylEased'], 'readwrite');
  //     const objectStore = transaction.objectStore('stylEased');

  //     // Check if a record with the same ID exists
  //     const getRequest = objectStore.get(nodeId);

  //     getRequest.onsuccess = function (event) {
  //       const stylEasedImage = (event.target as any).result;

  //       if (!stylEasedImage) {
  //         console.log('here')
  //         return
  //       } else {
  //         setFile(stylEasedImage);
  //       }
  //     };

  //   };
  //   console.log(file)
  // }, [request])



  const handleDownload = () => {}

  const renderPreviewJSX = () => {
    return (
      <div>
        <canvas aria-label={file?.data.name} ref={canvasRef} className='w-full rounded-[4px]'></canvas>
        <div className='mt-2 mb-0 truncate ...'>
          {file!.name}
        </div>
        <aside className='flex items-center justify-between mt-auto cursor-default top-4 relative pb-3'>
          <p className='border font-medium rounded-md border-zinc-200 bg-zinc-100 text-zinc-800 dark:border-neutral-200 dark:bg-neutral-200 dark:text-neutral-800 px-1 text-sm'>
            {convertBytestoMegabytes(file!.size)}mb
          </p>
          <button
            className=' bg-zinc-200 dark:bg-[--node-icons-color] rounded-full p-1 text-sm'
            onClick={handleDownload}
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
