import clsx from 'clsx'
import { Handle, Position } from 'reactflow'
import type { HandleProps } from 'reactflow'

interface Props extends HandleProps {
  className?: string
}

function NodeHandle({ className, ...props }: Props) {
  //TODO: set up the position of the node handle when its on the left of the node
  return (
    <Handle
      {...props}
      className={clsx(
        '!border-none !transform-none !w-[7px] !h-[7px] z-2 !bg-[--node-handle-color]',
        {
          '!left-[-0.55rem]': props.position !== Position.Right,
          '!right-[-0.125rem] !top-[1.65rem]': props.position === Position.Right
        },
        className
      )}
    ></Handle>
  )
}

export default NodeHandle
