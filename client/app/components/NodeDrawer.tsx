/* @unocss-include */
import { Panel } from 'reactflow'
import { nodeData } from '~/data/nodeData'
import React from 'react'
import clsx from 'clsx'
import { CustomNode } from '~/state/nodesState'
import randomStr from '~/lib/randomStr'

interface Props {
  onSelect: (data: CustomNode) => void | null
}

export default function NodeDrawer({ onSelect }: Props) {
  const [collapsed, setCollapsed] = React.useState(true)

  const collapseSidebar = () => {
    setCollapsed(!collapsed)
  }

  const addNode = (data: any) => {
    onSelect(data)
  }

  return (
    <Panel
      position='top-left'
      className={clsx(
        'flex flex-col gap-2 backdrop-blur-[--blur] items-center !top-[6rem] rounded-[8px] bg-[--drawer-color] border border-[--node-border-color] p-4',
        { 'w-75': !collapsed }
      )}
    >
      <h1 className='font-bold text-xl'>Node Drawer</h1>
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
                key={randomStr(10)}
                onClick={() => addNode(data)}
              >
                <button className='flex p-3 border border-[--node-border-color] rounded-[4px] hover:bg-[--hover-bg-color] hover:text-[--hover-color]' title={data.title}>
                  <span
                    className={clsx(`${data.icon} text-3xl flex`)}
                  ></span>
                  <span className='sr-only'>{data.title}</span>
                </button>
              </li>
            ))
          : nodeData.map((data) => (
              <li
                key={randomStr(10)}
                className='cursor-pointer border border-[--node-border-color] rounded-[4px] [&:not(:last-child)]:mb-4 p-2 hover:bg-[--hover-bg-color] hover:text-[--hover-color]'
                onClick={() => addNode(data)}
              >
                <div className='flex items-center justify-between text-xl'>
                  <p className='font-bold'>{data.title}</p>
                  <span className={clsx(`${data.icon} flex`)}></span>
                </div>

                <p>{data.description}</p>
              </li>
            ))}
      </ul>
      <button
        className='w-full flex items-center justify-center mt-1 p-1'
        onClick={collapseSidebar}
        title='Toggle sidebar'
      >
        <span
          className={clsx(
            'text-xl flex',
            { 'i-lucide-chevron-down': collapsed },
            { 'i-lucide-chevron-up': !collapsed }
          )}
        />
        <span className='sr-only'>Toggle sidebar</span>
      </button>
    </Panel>
  )
}
