import clsx from 'clsx'
import NodeHandle from './NodeHandle'
import { Position } from 'reactflow'

interface Props extends React.PropsWithChildren {
  nodeTitle: string
  className?: string
  iconClass?: string
  position: Position
}

function WrapperNode({ children, className, iconClass, nodeTitle, position }: Props) {
  const renderHandles = () => {
    switch(position) {
      case 'left':
        return <NodeHandle position={Position.Left} type='target' />
        break;
      case 'right':
        return <NodeHandle position={Position.Right} type='target' />
        break;
      default:
        return null;
    }
  }

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

      {renderHandles()}

      {children}
    </div>
  )
}

export default WrapperNode
