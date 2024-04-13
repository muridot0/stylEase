import { Position, type NodeProps } from 'reactflow'
import Attachment from './Attachment'
import WrapperNode from './WrapperNode'
import React from 'react'

interface Props {
  title: string
  icon: string
  content: File
}

export default React.memo(function StyleNode({ data }: NodeProps<Props>) {
  console.log(data)
  return (
    // TODO: conditionally set the iconClass based on whether user has uploaded an image (put a flag in signal to use)
    <WrapperNode
      nodeTitle={data.title}
      iconClass={data.icon}
      position={Position.Right}
    >
      <div className='flex -right-[0.8rem] top-[1rem] absolute'>
        <picture className='w-4 h-4 right-[0.05rem] absolute -top-[0.35rem] pointer-events-none'>
          <source
            srcSet='/bell-dark.svg'
            media='(prefers-color-scheme: dark)'
          />
          <img src='/bell.svg' alt='node handle' />
        </picture>
        <div className='bg-[--node-bg-color] absolute dark:bg-[-node-bg-color] h-7 right-[0.9rem] top-[0.1rem] w-1 ' />
      </div>
      <Attachment maxFileSize={3000000} label='Input Node' className='nodrag' />
    </WrapperNode>
  )
})

const STYLE_NODE_TYPE = 'style-node-type'

export { STYLE_NODE_TYPE }
