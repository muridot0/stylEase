import clsx from 'clsx'
import NodeHandle from './NodeHandle'
import { Position } from 'reactflow'

interface Props extends React.PropsWithChildren {
  nodeTitle: string
  className?: string
  iconClass?: string
}

function WrapperNode({ children, className, iconClass, nodeTitle }: Props) {
  return (
    <div
      className={clsx(
        className,
        'w-[13.5rem] bg-[--node-bg-color] border border-[--node-border-color] p-4 rounded-[8px] text-center'
      )}
    >
      <section className='flex items-center gap-2 mb-2 justify-center'>
        {iconClass && (
          <span className={clsx(iconClass, 'flex text-[--node-icons-color]')} />
        )}
        <h1>{nodeTitle}</h1>
      </section>

      <NodeHandle position={Position.Right} type='target' />

      {children}
    </div>
  )
}

export default WrapperNode
