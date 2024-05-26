import React from 'react'
import { Node, NodeProps, Position, getOutgoers, useReactFlow } from 'reactflow'
import WrapperNode from './WrapperNode'
import clsx from 'clsx'
import NodeHandle from './NodeHandle'
import globalNodeState, { CustomNode } from '~/state/nodesState'
import Slider from './Slider'
import MissingAttachment from './MissingAttachment'
import { Bounce, Id, toast } from 'react-toastify'
import { useFetcher } from '@remix-run/react'
import { b64toBlob } from '~/lib/imgToBlob'
import { db } from '~/lib/db'
import { resetFetcher } from '~/lib/resetFetcher'
interface Props {
  id: string
  title: string
  icon: string
  styleNodeConnected: boolean
  contentNodeConnected: boolean
  displayNodeId: string | null
  contentNodeId: string | null
  styleNodeId: string | null
}

interface FetcherData {
  url: number[]
  size: number
  width: number
  height: number
  name: string
}

export default React.memo(function ModelNode({
  data,
  selected,
  isConnectable,
  ...props
}: NodeProps<Props>) {
  const fetcher = useFetcher()
  const reactflow = useReactFlow()
  const [styleNodeConnected, setStyleNodeConnected] = React.useState(false)
  const [contentNodeConnected, setContentNodeConnected] = React.useState(false)
  const [displayNodeConnected, setDisplayNodeConnected] = React.useState(false)
  const [styleImage, setStyleImage] = React.useState<{
    name: string
    size: number
    url: string | ImageData
    width: number
    height: number
  }>()
  const [contentImage, setContentImage] = React.useState<{
    name: string
    size: number
    url: string | ImageData
    width: number
    height: number
  }>()
  const [stylizationStrength, setStylizationStrength] =
    React.useState<number>(0.5)

  const [stylEasing, setStylEasing] = React.useState(false)
  const toastRef = React.useRef<Id | null>(null)

  React.useEffect(() => {
    globalNodeState.subscribe((nodes) => {
      const currentNode = nodes.find((node) => node.id === props.id)
      setStyleNodeConnected(currentNode?.data.styleNodeConnected!)
      setContentNodeConnected(currentNode?.data.contentNodeConnected!)
      setDisplayNodeConnected(currentNode?.data.displayNodeConnected!)
      setStyleImage(currentNode?.data.styleImage)
      setContentImage(currentNode?.data.contentImage)
    })
  }, [
    globalNodeState.value,
    styleNodeConnected,
    contentNodeConnected,
    displayNodeConnected,
  ])

  const restoreImages = async () => {
    const flow = await db.flow.get(1)

    if(!flow) return

    flow.nodes.map((node): void => {
      if (node.data.id === data.id) {
        setStyleImage(node.data.styleImage)
        setContentImage(node.data.contentImage)
      }
    })
  }

  React.useEffect(() => {
    restoreImages()
  }, [])

  React.useEffect(() => {
    globalNodeState.subscribe((nodes) => {
      const currentNode = nodes.find((node) => node.id === props.id)
      setStyleImage(currentNode?.data.styleImage)
      setContentImage(currentNode?.data.contentImage)
    })
  }, [
    globalNodeState.value,
    setStyleImage,
    setContentImage
  ])

  React.useEffect(() => {
    const outgoers = getOutgoers(
      reactflow.getNode(props.id)!,
      reactflow.getNodes(),
      reactflow.getEdges()
    )
    let data = fetcher.data as FetcherData
    if (!data || fetcher.state !== 'idle') {
      outgoers.map((displayNode) => {
        return reactflow.setNodes((nodes) => {
          nodes.map((node: Node<CustomNode>) => {
            if (displayNode.id === node.id) {
              if(node.data.content) return
              node.data.content = undefined
            }
          })
          return nodes
        })
      })
      return
    }

    const name = data.name
    const uint8ClampedArr = new Uint8ClampedArray(data.url)

    const imgData = new ImageData(uint8ClampedArr, data.width, data.height)

    outgoers.map((displayNode) => {
      return reactflow.setNodes((nodes) => {
        nodes.map((node: Node<CustomNode>) => {
          if (displayNode.id === node.id) {
            node.data.content = {
              url: imgData,
              name: `stylEased_${name}`,
              size: imgData.data.byteLength,
              width: imgData.width,
              height: imgData.height
            }
            node.data.stylEasing = false
          }
        })
        return nodes
      })
    })
    setStylEasing(false)
    resetFetcher(fetcher)
  }, [fetcher])

  const stylEase = async () => {
    if (!contentImage?.url || !styleImage?.url) {
      if (toastRef.current) {
        toast.dismiss()
      }
      toastRef.current = toast(
        <MissingAttachment
          contentImage={contentImage?.url !== undefined}
          styleImage={styleImage?.url !== undefined}
        />,
        {
          position: 'top-center',
          autoClose: false,
          pauseOnHover: true,
          draggable: true,
          transition: Bounce,
          className: 'backdrop-blur-[--blur]'
        }
      )
      return toastRef.current
    }

    setStylEasing(true)

    const formData = new FormData()

    const styleBlob = b64toBlob(styleImage.url as string)

    const contentBlob = b64toBlob(contentImage.url as string)

    formData.append('style-image', styleBlob)
    formData.append('content-image', contentBlob)
    formData.append('style-ratio', stylizationStrength.toString())
    formData.append('display-name', contentImage.name)

    const outgoers = getOutgoers(
      reactflow.getNode(props.id)!,
      reactflow.getNodes(),
      reactflow.getEdges()
    )

    outgoers.map((displayNode) => {
      return reactflow.setNodes((nodes) => {
        nodes.map((node: Node<CustomNode>) => {
          if (displayNode.id === node.id) {
            node.data.content = undefined
            node.data.stylEasing = true
            console.log(node)
          }
        })
        return nodes
      })
    })
    fetcher.submit(formData, {
      action: `/styletransfer/${data.id}`,
      method: 'post',
      encType: 'multipart/form-data'
    })

  }

  return (
    <div>
      <WrapperNode
        nodeTitle={data.title}
        iconClass={data.icon}
        position={Position.Right}
        selected={selected}
        nodeId={props.id}
      >
        <div className='flex -right-[0.8rem] top-[1rem] absolute'>
          <svg
            width='10'
            height='31'
            viewBox='0 0 10 31'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='light:hidden right-[0.1rem] absolute -top-[0.35rem] pointer-events-none'
          >
            <path
              d='M0.5 15.1438C0.5 12.7374 0.730915 8.45835 1.00572 5.07127C1.33511 6.36047 1.98291 7.16317 2.78092 7.80609C3.19447 8.13926 3.64925 8.43025 4.09797 8.71736L4.12982 8.73774C4.59342 9.03442 5.05841 9.33337 5.52122 9.69568C5.85213 9.97374 6.18734 10.2355 6.50188 10.4812C6.67116 10.6134 6.83445 10.7409 6.98787 10.8638C7.44107 11.2268 7.83545 11.5697 8.16459 11.9504C8.80105 12.6864 9.22727 13.6011 9.22727 15.1438C9.22727 16.6949 8.80006 17.6252 8.16344 18.3668C7.83492 18.7494 7.4412 19.0925 6.98993 19.45C6.81238 19.5907 6.61427 19.7423 6.40759 19.9005C6.11802 20.1221 5.81163 20.3565 5.52146 20.5918C5.21215 20.8426 4.85349 21.077 4.47476 21.3245C3.16334 22.1814 1.61121 23.1956 1.03342 25.5943C0.74657 22.117 0.5 17.6305 0.5 15.1438Z'
              fill='#3B4045'
              stroke={clsx({ '#4D5259': !selected }, { '#b3b3b3': selected })}
            />
          </svg>
          <svg
            width='10'
            height='31'
            viewBox='0 0 10 31'
            fill='none'
            xmlns='http://www.w3.org/2000/svg'
            className='dark:hidden right-[0.1rem] absolute -top-[0.35rem] pointer-events-none'
          >
            <path
              d='M0.5 15.1438C0.5 12.7374 0.730915 8.45835 1.00572 5.07127C1.33511 6.36047 1.98291 7.16317 2.78092 7.80609C3.19447 8.13926 3.64925 8.43025 4.09797 8.71736L4.12982 8.73774C4.59342 9.03442 5.05841 9.33337 5.52122 9.69568C5.85213 9.97374 6.18734 10.2355 6.50188 10.4812C6.67116 10.6134 6.83445 10.7409 6.98787 10.8638C7.44107 11.2268 7.83545 11.5697 8.16459 11.9504C8.80105 12.6864 9.22727 13.6011 9.22727 15.1438C9.22727 16.6949 8.80006 17.6252 8.16344 18.3668C7.83492 18.7494 7.4412 19.0925 6.98993 19.45C6.81238 19.5907 6.61427 19.7423 6.40759 19.9005C6.11802 20.1221 5.81163 20.3565 5.52146 20.5918C5.21215 20.8426 4.85349 21.077 4.47476 21.3245C3.16334 22.1814 1.61121 23.1956 1.03342 25.5943C0.74657 22.117 0.5 17.6305 0.5 15.1438Z'
              fill='#EDEDEE'
              stroke={clsx({ '#BBBDC1': !selected }, { '#808080': selected })}
            />
          </svg>
          <div className='bg-[--node-bg-color] absolute dark:bg-[-node-bg-color] h-8 right-[0.8rem] w-1' />
        </div>
        <div>
          {/**These only need to receive connection rather than be able to be connected */}
          <NodeHandle
            id='style-input'
            className='!top-[4.6rem]'
            type='target'
            position={Position.Left}
          />
          <NodeHandle
            id='content-input'
            className='!top-[6.6rem]'
            type='target'
            position={Position.Left}
          />
        </div>
        <div className=''>
          <p
            className={clsx('pb-2 text-left', {
              '!text-[--node-icons-color]': !styleNodeConnected
            })}
          >
            {!styleNodeConnected ? 'Attach a style node ...' : 'Style node'}
          </p>
          <p
            className={clsx('text-left', {
              'text-[--node-icons-color]': !contentNodeConnected
            })}
          >
            {!contentNodeConnected
              ? 'Attach a content node ...'
              : 'Content node'}
          </p>
        </div>
        <Slider
          className='mt-4 nodrag'
          onChange={(e) => setStylizationStrength(parseFloat(e))}
          disabled={
            !contentNodeConnected ||
            !styleNodeConnected ||
            !displayNodeConnected
          }
        ></Slider>
      </WrapperNode>
      {styleNodeConnected && contentNodeConnected && displayNodeConnected && (
        <button
          onClick={stylEase}
          className={clsx(
            'mt-2 flex gap-2 items-center bg-[--node-bg-color] border border-[--node-border-color] p-1 rounded-[4px] absolute top-[12.65rem] hover:bg-[--hover-bg-color] hover:text-[--hover-color]',
            {
              '!bg-[--disabled] !text-[--node-border-color]':
                !contentImage?.url || !styleImage?.url || stylEasing
            }
          )}
          disabled={stylEasing}
        >
          <span className='i-lucide-play flex' /> stylEase!
        </button>
      )}
    </div>
  )
})
