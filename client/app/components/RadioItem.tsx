import { computed, effect } from '@preact/signals'
import React from 'react'
import { BackgroundVariant } from 'reactflow'
import backgroundState from '~/state/backgroundState'

interface Props {
  value: BackgroundVariant
}

export default function RadioItem({ value }: Props) {

  const checked = computed(() => backgroundState.value)

  const handleSelectedItem = (event: any) => {
    const selectedValue = event.target.value.toLowerCase()
    effect(() => {
      backgroundState.value = selectedValue
    })
    console.log(backgroundState.value, checked.value)
  }

  return (
    <div className='flex items-center gap-2'>
      <input
        className='cursor-pointer bg-[--node-bg-color]'
        type='radio'
        id={value}
        name='background-variants'
        value={value}
        onChange={handleSelectedItem}
        checked={value.toLowerCase() === checked.value}
      />
      <label htmlFor={value}>{value}</label>
    </div>
  )
}
