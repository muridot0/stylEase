/* @unocss-include */
import { Panel } from 'reactflow'
import { nodeData } from '~/data/nodeData'
import React from 'react'
import clsx from 'clsx'
import { CustomNode } from '~/state/nodesState'

interface Props {
  onSelect: (data: CustomNode) => void | null
}

export default function NodeDrawer({ onSelect }: Props) {
  const [collapsed, setCollapsed] = React.useState(true)

  const collapseSidebar = () => {
    setCollapsed(!collapsed)
  }

  const addNode = (data: CustomNode) => {
    onSelect(data)
  }

  return (
    <Panel
      position='top-left'
      className={clsx(
        'flex flex-col gap-2 items-center !top-[6rem] rounded-[8px] bg-[--node-bg-color] border border-[--node-border-color] p-4',
        { 'w-75': !collapsed }
      )}
    >
      <h1 className='font-bold'>Node Drawer</h1>
      <ul
        className={clsx(
          'w-full',
          { flex: collapsed },
          {
            block: !collapsed
          }
        )}
      >
        {collapsed
          ? nodeData.map((data) => (
              <li
                className='[&:not(:last-child)]:mr-4'
                key={data.id}
                onClick={() => addNode(data)}
              >
                <button className='flex p-3 border border-[--node-border-color] rounded-[4px] hover:bg-[--hover-bg-color] hover:text-[--hover-color]'>
                  <span
                    className={clsx(`${data.icon} text-3xl flex`)}
                  ></span>
                </button>
              </li>
            ))
          : nodeData.map((data) => (
              <li
                key={data.id}
                className='cursor-pointer border border-[--node-border-color] rounded-[4px] [&:not(:last-child)]:mb-4 p-2 hover:bg-[--hover-bg-color] hover:text-[--hover-color]'
                onClick={() => addNode(data)}
              >
                <div className='flex items-center justify-between text-xl'>
                  <p>{data.title}</p>
                  <span className={clsx(`${data.icon} flex`)}></span>
                </div>

                <p className='text-[--node-icons-color]'>{data.description}</p>
              </li>
            ))}
      </ul>
      <button
        className='bg-[--node-bg-color] border rounded-full border-[--node-border-color] absolute -right-10 top-0 p-1'
        onClick={collapseSidebar}
      >
        <span
          className={clsx(
            'text-xl flex',
            { 'i-lucide-chevron-down': collapsed },
            { 'i-lucide-chevron-up': !collapsed }
          )}
        />
      </button>
    </Panel>
  )
}
