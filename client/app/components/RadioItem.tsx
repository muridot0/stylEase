import React from "react";
import { BackgroundVariant } from "reactflow";
import backgroundState from "~/state/backgroundState";

interface Props {
  value: BackgroundVariant
}

export default function RadioItem({value}: Props) {

  const handleSelectedItem = (event: any) => {
    console.log(event)
    backgroundState.value = event.target.value.toLowerCase() as BackgroundVariant
    console.log('in the on change', value, backgroundState.value)
  }

  return (
    <div className="flex items-center gap-2">
      <input className="cursor-pointer bg-[--node-bg-color]" type="radio" id={value} name="background-variants" value={value} onChange={handleSelectedItem}/>
      <label htmlFor={value}>{value}</label>
    </div>
  )
}