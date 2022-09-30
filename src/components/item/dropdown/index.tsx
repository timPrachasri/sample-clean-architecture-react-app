import { Menu, Transition } from '@headlessui/react'
import { some } from 'fp-ts/lib/Option'
import React, { Fragment } from 'react'
import { TrashIcon, EditActiveIcon, EditInactiveIcon, MoreHorizontalIcon } from '~/components/icons'
import { ItemEntity } from '~/entities'
import { useDeepCallback } from '~/hooks'
import { useAppContext } from '~/providers'

export const ItemOptionsDropdownComponent = ({ item }: { item: ItemEntity }) => {
  const { setIsUpdateItemModalOpen, setSelectedItem, setIsDeleteItemModalOpen } = useAppContext()

  const openUpdateItemModal = useDeepCallback((): void => {
    setIsUpdateItemModalOpen(true)
    setSelectedItem(some(item))
  }, [item, setIsUpdateItemModalOpen, setSelectedItem])

  const openDeleteItemModal = useDeepCallback((): void => {
    setIsDeleteItemModalOpen(true)
    setSelectedItem(some(item))
  }, [item, setIsDeleteItemModalOpen, setSelectedItem])

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md hover:bg-primary-content">
          <MoreHorizontalIcon />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1 ">
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={openUpdateItemModal}
                  className={`${
                    active ? 'bg-primary-content' : ''
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? <EditActiveIcon className="mr-2 h-5 w-5" /> : <EditInactiveIcon className="mr-2 h-5 w-5" />}
                  <span className="font-medium">Details</span>
                </button>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <button
                  onClick={openDeleteItemModal}
                  className={`${active ? 'bg-error' : ''} group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  {active ? (
                    <>
                      <TrashIcon className="mr-2 h-5 w-5 text-error-content" />
                      <span className="font-medium text-error-content">Delete</span>
                    </>
                  ) : (
                    <>
                      <TrashIcon className="mr-2 h-5 w-5 text-error" />
                      <span className="font-medium text-error">Delete</span>
                    </>
                  )}
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
