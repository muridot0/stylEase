import clsx from 'clsx'
import React from 'react'

interface Props {
  className?: string
  onChange: (val: string) => void
}

export default function Slider({ className, onChange }: Props) {
  const [sliderValue, setSliderValue] = React.useState<string>('0.5')

  return (
    <div className={clsx(className)}>
      <div className='flex items-center mb-1 text-sm justify-between'>
        <div className='flex items-center gap-2 text-[--node-icons-color]'>
          <span className='i-iconoir-gym flex' />
          <p>Style strength</p>
        </div>
        <p className='tabular-nums'>{(parseFloat(sliderValue) * 100).toFixed(0)}%</p>
      </div>
      <input
        type='range'
        min='0.1'
        max='1'
        step='0.01'
        value={sliderValue}
        className='w-full range-style'
        onChange={(e) => {
          onChange(e.currentTarget.value)
          setSliderValue(e.currentTarget.value)
        }}
      />
    </div>
  )
}
