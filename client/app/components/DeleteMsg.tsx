interface Props {
  onDelete: () => void
  onCancel: () => void
}

export default function DeleteMsg({ onDelete, onCancel }: Props) {
  return (
    <div className='flex flex-col gap-2'>
      <h1 className='font-bold text-red-500'>Delete all nodes?</h1>

      <p className='dark:text-[#EEEFEF] text-[#222428]'>
        This is an irreversible action!
      </p>

      <div className='flex justify-center mt-2 gap-2 text-lg'>
        <button
          className='rounded-[4px] border border-[--node-border-color] dark:text-[#EEEFEF] text-[#222428] py-1 px-2'
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          className='rounded-[4px] bg-red-500 flex items-center gap-2 text-[#EEEFEF] py-1 px-2'
          onClick={onDelete}
        >
          <span className='i-lucide-trash2 flex' /> Clear nodes
        </button>
      </div>
    </div>
  )
}
