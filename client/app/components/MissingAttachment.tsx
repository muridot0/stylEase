interface Props {
  contentImage: boolean
  styleImage: boolean
}

export default function MissingAttachment({ contentImage, styleImage }: Props) {
  return (
    <div>
      {!styleImage && !contentImage ? (
        <div className="p-2 flex flex-col gap-2">
          <div className='flex gap-4 items-center'>
            <span className='i-iconoir-brain-warning text-4xl text-red-500' />
            <h1 className='font-bold text-lg'>
              Missing style and content images
            </h1>
          </div>
          <hr className='border-t-[--node-border-color] me-4 ms-4'/>
          <p className="">Attach a <i className="font-bold">style image</i> and a <i className="font-bold">content image</i> to get started</p>
        </div>
      ) : !styleImage ? (
        <div className="p-2 flex flex-col gap-2">
          <div className='flex gap-4 items-center'>
            <span className='i-iconoir-brain-warning text-4xl text-red-500' />
            <h1 className='font-bold text-lg'>
              Missing style image
            </h1>
          </div>
          <hr className='border-t-[--node-border-color] me-4 ms-4'/>
          <p className="">Attach a <i className="font-bold">style image</i> to get started</p>
        </div>
      ) : (
        <div className="p-2 flex flex-col gap-2">
          <div className='flex gap-4 items-center'>
            <span className='i-iconoir-brain-warning text-4xl text-red-500' />
            <h1 className='font-bold text-lg'>
              Missing content image
            </h1>
          </div>
          <hr className='border-t-[--node-border-color] me-4 ms-4'/>
          <p className="">Attach a <i className="font-bold">content image</i> to get started</p>
        </div>
      )}
    </div>
  )
}
