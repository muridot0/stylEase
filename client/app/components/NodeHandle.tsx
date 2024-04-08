import { Handle, Position } from 'reactflow'
import type { HandleProps } from 'reactflow'

interface Props extends HandleProps {
  className?: string
}

function NodeHandle({ className, ...props }: Props) {
  return (
    <Handle {...props} className={className}>
      <div className='w-full h-full bg-zinc-400 dark:bg-neutral-400 rounded-full pointer-events-none' />
    </Handle>
  )
}

export default NodeHandle
