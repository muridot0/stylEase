
interface Props {
  onClick: () => void
}

export default function DeleteMsg({onClick}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="font-bold text-red-500">Are you sure you want to delete all nodes!</h1>
      <p className="text-[--node-icons-color]">Make sure to download all your stylEased images because this is an irreversible action</p>
      <button onClick={onClick}>Delete</button>
    </div>
  )
}