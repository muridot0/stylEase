import React from 'react'
import {
  Connection,
  NodeProps,
  Position,
  getIncomers,
  useReactFlow,
  useStore,
  useStoreApi,
  useOnSelectionChange
} from 'reactflow'
import WrapperNode from './WrapperNode'
import clsx from 'clsx'
import NodeHandle from './NodeHandle'
import globalNodeState from '~/state/nodesState'
import { signal } from '@preact/signals'

interface Props {
  title: string
  icon: string
  styleNodeConnected: boolean
  contentNodeConnected: boolean

}


export default React.memo(function ModelNode({
  data,
  selected,
  isConnectable,
  onConnect,
  ...props
}: NodeProps<Props> & any) {
  const styleSignal = signal({styleNodeConnected: false, contentNodeConnected: false})
  const [styleNodeConnected, setStyleNodeConnected] = React.useState(false)
  const [contentNodeConnected, setContentNodeConnected] = React.useState(false)
  const store = useStoreApi()
  const reactflow = useReactFlow()

  let edges
  store.subscribe((state) => {
    edges = state.edges
    // console.log(state.edges)
  })

  useOnSelectionChange({
    onChange: ({edges}) => {
      console.log('edges here', edges)
    }
  })

  React.useEffect(() => {
    //TODO: handle remove style when edge is disconnected here

    const incommers = getIncomers(
      reactflow.getNode(props.id)!,
      reactflow.getNodes(),
      reactflow.getEdges()
    )
    console.log(incommers)
    globalNodeState.subscribe((nodes) => {nodes.map((node) => {
      if (incommers && incommers.length !== 0 && node.id === props.id) {
        // node.data = {
        //   ...node.data,
        //   styleNodeConnected: true
        // }

        setStyleNodeConnected(node.data.styleNodeConnected!)
      } else if (incommers && incommers.length === 0 && node.id === props.id) {
        // console.log('i go in')
        // node.data = {
        //   ...node.data,
        //   styleNodeConnected: false
        // }
        setStyleNodeConnected(node.data.styleNodeConnected!)
      }
    })})
    // globalNodeState.value.map((node): void => {
    //   if (incommers && incommers.length !== 0 && node.id === props.id) {
    //     // node.data = {
    //     //   ...node.data,
    //     //   styleNodeConnected: true
    //     // }

    //     setStyleNodeConnected(node.data.styleNodeConnected!)
    //   } else if (incommers && incommers.length === 0 && node.id === props.id) {
    //     // console.log('i go in')
    //     // node.data = {
    //     //   ...node.data,
    //     //   styleNodeConnected: false
    //     // }
    //     setStyleNodeConnected(node.data.styleNodeConnected!)
    //   }

    //   // if(node.id === props.id) {
    //   //   setStyleNodeConnected(node.data.styleNodeConnected!)
    //   // }
    //   // if no incommers set the node.data.styleNodeConnected value of the current node to false and set the state to false
    // })
  }, [globalNodeState.value])

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
          <NodeHandle
            id='style-input'
            className='!top-[4.6rem]'
            type='target'
            position={Position.Left}
            onConnect={onConnect}
          />
          <NodeHandle
            id='content-input'
            className='!top-[6.6rem]'
            type='target'
            position={Position.Left}
            onConnect={onConnect}
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
      </WrapperNode>
      {styleNodeConnected && contentNodeConnected && (
        <button className='mt-2 flex gap-2 items-center bg-[--node-bg-color] border border-[--node-border-color] p-1 rounded-[4px] absolute top-[9.5rem] hover:bg-[--hover-bg-color] hover:text-[--hover-color]'>
          <span className='i-lucide-play flex' /> stylEase!
        </button>
      )}
    </div>
  )
})

const MODEL_NODE_TYPE = 'model-node-type'

export { MODEL_NODE_TYPE }
