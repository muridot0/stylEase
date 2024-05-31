import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  disabled: boolean
  onChange: (val: string) => void
}

export default function Slider({ className, onChange, disabled }: Props) {
  const [sliderValue, setSliderValue] = React.useState<string>('0.5')
  const rangeRef = React.useRef<HTMLDivElement>(null)

  const animateNums = () => {
    if (!rangeRef.current) return
    let top = ((parseFloat(sliderValue) - 0.1) / 0.01) * -15

    requestAnimationFrame(() => {
      rangeRef.current!.style.marginTop = `${top}px`
    })
  }

  React.useEffect(() => {
    animateNums()
  }, [sliderValue])

  const numArr = []

  for (let i = 0.1; i <= 1.01; i += 0.01) {
    numArr.push((i * 100).toFixed(0))
  }

  return (
    <div className={clsx(className)}>
      <div className='flex items-center text-sm justify-between'>
        <div className='flex items-center gap-2 text-[--node-icons-color]'>
          <span className='i-iconoir-gym flex' />
          <p>Style strength</p>
        </div>
          <div className={clsx('overflow-hidden h-[16px]',{'opacity-10': disabled})}>
            <div className='flex'>
              <div
                ref={rangeRef}
                className='transition-all duration-300 ease-in-out -mt-[600px]'
              >
                {numArr.map((num) => (
                  <div key={num} className='tabular-nums'>
                    {num}
                  </div>
                ))}
              </div>
              <p className='ml-1'>%</p>
            </div>
          </div>
      </div>
      <input
        type='range'
        min='0.1'
        max='1'
        step='0.01'
        value={sliderValue}
        className={clsx('w-full cursor-pointer flex mt-3')}
        onChange={(e) => {
          onChange(e.currentTarget.value)
          setSliderValue(e.currentTarget.value)
        }}
        disabled={disabled}
      />
    </div>
  )
}
