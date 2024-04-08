import Attachment from './Attachment'
import WrapperNode from './WrapperNode'

export default function InputNode() {
  // TODO: add functionality for input node
  return (
    <WrapperNode nodeTitle='Style Node' iconClass='i-lucide-image-plus'>
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
      <Attachment maxFileSize={500000} label='hmm' className='nodrag' />
    </WrapperNode>
  )
}
