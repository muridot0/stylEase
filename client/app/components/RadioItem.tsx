import { computed } from '@preact/signals'
import React from 'react'
import { BackgroundVariant, ReactFlowProvider } from 'reactflow'
import backgroundState from '~/state/backgroundState'

interface Props {
  value: BackgroundVariant
}

function RadioItem({ value }: Props) {
  const checked = computed(() => backgroundState.value)

  React.useEffect(() => {}, [backgroundState.value])

  const handleSelectedItem = (event: any) => {
    const selectedValue = event.target.value.toLowerCase()
    backgroundState.value = selectedValue
  }

  return (
    <li className='flex items-center gap-2'>
      <input
        className='cursor-pointer appearance-none border border-[--node-border-color] rounded-full checked:bg-[--node-handle-color] checked:border-transparent h-4 w-4'
        type='radio'
        id={value}
        name='background-variants'
        value={value}
        onChange={handleSelectedItem}
        checked={value.toLowerCase() === checked.value}
      />
      <label className="cursor-pointer" htmlFor={value}>{value}</label>
    </li>
  )
}

export default function RadioItemWithProvider({ value }: Props) {
  return (
    <ReactFlowProvider>
      <RadioItem value={value}></RadioItem>
    </ReactFlowProvider>
  )
}
