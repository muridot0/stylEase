import clsx from 'clsx'
import NodeHandle from './NodeHandle'
import { Position } from 'reactflow'

interface Props extends React.PropsWithChildren {
  className?: string
}

function WrapperNode({ children, className }: Props) {
  return (
    <div
      className={clsx(
        className,
        'w-[13.5rem] bg-[--node-bg-color] border border-[--node-border-color] p-4 rounded-[8px]'
      )}
    >
      <NodeHandle position={Position.Right} type='target' />

      {children}
    </div>
  )
}

export default WrapperNode
