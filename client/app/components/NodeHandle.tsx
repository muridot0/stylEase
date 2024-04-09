import clsx from 'clsx'
import { Handle, Position } from 'reactflow'
import type { HandleProps } from 'reactflow'

interface Props extends HandleProps {
  className?: string
}

function NodeHandle({ className, ...props }: Props) {
  return (
    <Handle
      {...props}
      className={clsx(
        '!transform-none',
        {
          '!left-[0.1rem] !rounded-none !border-t-4 !border-b-4 !border-l-8 !border-t-transparent !border-b-transparent !border-l-[--node-handle-color] no-bg': props.position !== Position.Right,
          '!right-[-0.125rem] !border-none !w-[7px] !h-[7px] !top-[1.65rem] z-2 !bg-[--node-handle-color]': props.position === Position.Right
        },
        className
      )}
    ></Handle>
  )
}

export default NodeHandle
