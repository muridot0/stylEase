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
  //TODO: add functionality to delete node (should show delete icon on hover)
  const renderHandles = () => {
    switch(position) {
      case 'left':
        return <NodeHandle type="target" position={Position.Left}/>
        break;
      case 'right':
        return <NodeHandle id='a' type="source" position={Position.Right} />
        break;
      default:
        return null;
    }
  }

  return (
    <div
      className={clsx(
        className,
        'w-full min-w-[200px] bg-[--node-bg-color] border border-[--node-border-color] py-6 px-10 rounded-[8px] text-center'
      )}
    >
      <section className='flex items-center gap-2 mb-4 justify-center'>
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
