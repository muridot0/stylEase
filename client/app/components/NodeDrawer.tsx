import { Panel } from 'reactflow'
import { nodeData } from '~/data/nodeData'
import DrawerItem from './DrawerItem'
import React from 'react'
import clsx from 'clsx'

export default function NodeDrawer() {
  //TODO: complete node drawer component and add the option to close it down
  const [collapsed, setCollapsed] = React.useState(true)

  const collapseSidebar = () => {
    setCollapsed(!collapsed)
  }

  return (
    <Panel
      position='top-left'
      className={clsx(
        'flex items-center top-[25rem] rounded-[8px] bg-[--node-bg-color] border border-[--node-border-color] p-4',
        { 'w-75': !collapsed }
      )}
      style={{ top: 150 }}
    >
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
              <li className='[&:not(:last-child)]:mr-4' key={data.id}>
                <button className='flex p-3 border border-[--node-border-color] rounded-[4px] hover:bg-[--hover-bg-color] hover:text-[--hover-color]'>
                  <span
                    className={clsx(`${data.icon} text-3xl flex`, {
                      'i-lucide-brain-cog': data.icon === 'i-lucide-brain-cog'
                    })}
                  ></span>
                </button>
              </li>
            ))
          : nodeData.map((data) => (
              <li className='border border-[--node-border-color] rounded-[4px] [&:not(:last-child)]:mb-4 p-2 hover:bg-[--hover-bg-color] hover:text-[--hover-color]'>
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
