import { computed, effect } from '@preact/signals'
import React from 'react'
import { BackgroundVariant, ReactFlowProvider, useReactFlow } from 'reactflow'
import backgroundState from '~/state/backgroundState'

interface Props {
  value: BackgroundVariant
}

function RadioItem({ value }: Props) {
  const reactflow = useReactFlow()

  const checked = computed(() => backgroundState.value)

  React.useEffect(() => {
  }, [backgroundState.value])

  const handleSelectedItem = (event: any) => {
    const selectedValue = event.target.value.toLowerCase()
      backgroundState.value = selectedValue
      console.log(backgroundState.value, checked.value)
    const nodes = reactflow.getNodes()
    const newNodes = [...nodes]
    reactflow.setNodes(newNodes)
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

export default function RadioItemWithProvider({value}: Props) {
  return (
    <ReactFlowProvider>
      <RadioItem value={value}></RadioItem>
    </ReactFlowProvider>
  )
}
