import { isSome, match, some } from 'fp-ts/lib/Option'
import type { NextPage } from 'next'
import React, { Dispatch, Fragment, SetStateAction, startTransition, useCallback, useState } from 'react'
import { EditActiveIcon, EditInactiveIcon, MoreHorizontalIcon } from '~/components/icons'
import { ImageWithFallback } from '~/components/image/ImageWithFallback'
import { useAppContext } from '~/providers'
import PlusMinus from '../../public/svgs/plus-minus.svg'

import { Menu, Transition } from '@headlessui/react'
import { Modal, ModalContent, ModalFooter, ModalHeader } from '~/components/modal'
import { ItemEntity } from '~/entities'
import { useDeepCallback, useDeepMemo } from '~/hooks'
import { GhostTextInput } from '~/components/input'
import { DateTime } from 'luxon'
import { DEFAULT_UNIT_NAME } from '~/constants'
import { formatInteger } from '~/utils/common/format'
import { IItemUpdateParams } from '~/entities/item/interfaces'

const ProceedModal = ({
  isProceedModalOpen,
  setIsProceedModalOpen,
  callback,
  message,
}: {
  isProceedModalOpen: boolean
  setIsProceedModalOpen: (value: React.SetStateAction<boolean>) => void
  callback: () => void
  message?: string
}): JSX.Element => {
  const closeAndProceedModal = (): void => {
    setIsProceedModalOpen(false)
    callback()
  }

  const closeModal = (): void => {
    setIsProceedModalOpen(false)
  }

  return (
    <>
      <Modal
        className="bg-base-100 z-99 text-base-content border-none"
        size="tiny"
        onDismiss={closeModal}
        isOpen={isProceedModalOpen}
      >
        <ModalHeader
          title={
            <div className="pt-2 px-4">
              <div className="py-4">{message ?? 'Are you sure you want to proceed?'}</div>
            </div>
          }
          onClose={closeModal}
        />
        <ModalContent>
          <div className="pb-6 px-4 w-full flex justify-around">
            <button className="btn btn-primary" onClick={() => setIsProceedModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary " onClick={closeAndProceedModal}>
              Proceed
            </button>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}

const UpdateQuantityModal = (): JSX.Element => {
  const { isUpdateQuantityModalOpen, setIsUpdateQuantityModalOpen, selectedItem, updateItem } = useAppContext()
  const [updatedItem, setUpdatedItem] = useState<IItemUpdateParams>({})
  const [isProceedModalOpen, setProceedItemModalOpen] = useState<boolean>(false)
  const [counter, setCounter] = useState<number>(0)

  const hasUpdatedValue = useDeepMemo(() => {
    return isSome(selectedItem) && selectedItem.value.hasUpdatedValue(updatedItem)
  }, [updatedItem, selectedItem])

  const closeModal = useCallback((): void => {
    setIsUpdateQuantityModalOpen(false)
    startTransition(() => {
      setCounter(0)
      setUpdatedItem({})
    })
  }, [setIsUpdateQuantityModalOpen])

  const openProceedItemModal = useCallback((): void => {
    setProceedItemModalOpen(true)
  }, [])

  const itemQuantity = useDeepMemo(() => {
    return match<ItemEntity, number>(
      () => 0,
      (item) => updatedItem.quantity ?? item.quantity
    )(selectedItem)
  }, [selectedItem, updatedItem.quantity])

  const increment = useDeepCallback(() => {
    setCounter((prev) => prev + 1)
    setUpdatedItem((prev) => ({ ...prev, quantity: itemQuantity + 1 }))
  }, [itemQuantity])

  const decrement = useDeepCallback(() => {
    if (itemQuantity - 1 < 0) return
    setCounter((prev) => prev - 1)
    setUpdatedItem((prev) => ({ ...prev, quantity: itemQuantity - 1 }))
  }, [itemQuantity])

  const save = useDeepCallback(async () => {
    if (isSome(selectedItem)) {
      closeModal()
      await updateItem(selectedItem.value, updatedItem)
    }
  }, [selectedItem, updatedItem, updateItem, closeModal])

  return (
    <>
      <ProceedModal
        isProceedModalOpen={isProceedModalOpen}
        setIsProceedModalOpen={setProceedItemModalOpen}
        callback={closeModal}
        message="Are you sure you want to discard all changes?"
      ></ProceedModal>
      <Modal
        className="bg-base-100 z-99 text-base-content border-none"
        size="tiny"
        onDismiss={hasUpdatedValue ? openProceedItemModal : closeModal}
        isOpen={isUpdateQuantityModalOpen}
      >
        <ModalHeader
          title={
            <div className="pt-2 px-4">
              <div className="py-4 text-xl font-bold">Adjust Quantity</div>
            </div>
          }
          onClose={hasUpdatedValue ? openProceedItemModal : closeModal}
        />
        <ModalContent>
          <div className="pb-6 px-4 w-full">
            <div className="flex justify-around">
              <div onClick={decrement} className="text-2xl cursor-pointer font-bold">
                -
              </div>
              <div className="text-xl text-base-300 font-bold">{counter}</div>
              <div onClick={increment} className="text-2xl cursor-pointer font-bold">
                +
              </div>
            </div>
            <div className="divider"> </div>
            <div className="flex flex-col w-full">
              <div className="text-xs font-extralight py-2">New Quantity</div>
              <GhostTextInput
                callback={(value) => {
                  setUpdatedItem((prev) => {
                    return {
                      ...prev,
                      quantity: parseInt(value),
                    }
                  })
                }}
                value={itemQuantity.toString()}
                className="text-sm"
                baseBlock="c-updateItemInputBody"
                type="number"
                min={0}
              ></GhostTextInput>
            </div>
          </div>
        </ModalContent>
        <ModalFooter>
          <div className="px-4 py-4 text-center">
            <button onClick={save} className="btn btn-wide btn-primary" disabled={!hasUpdatedValue}>
              Save
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}

const UpdateItemModalHeader = ({
  updatedItem,
  setUpdatedItem,
}: {
  updatedItem: IItemUpdateParams
  setUpdatedItem: Dispatch<SetStateAction<IItemUpdateParams>>
}): JSX.Element => {
  const { selectedItem } = useAppContext()

  const itemName = useDeepMemo(() => {
    return match<ItemEntity, string>(
      () => '-',
      (item) => updatedItem.name ?? item.name
    )(selectedItem)
  }, [selectedItem, updatedItem.name])

  const itemPictureSrc = useDeepMemo(() => {
    return match<ItemEntity, string>(
      () => '',
      (item) =>
        `${process.env.WORK_TRIAL_API_URL}/images/${match(
          () => '',
          (pic) => pic
        )(item.picture)}`
    )(selectedItem)
  }, [selectedItem])

  const itemID = useDeepMemo(() => {
    return match<ItemEntity, string>(
      () => '-',
      (item) => item.id
    )(selectedItem)
  }, [selectedItem])

  const itemUpdatedAt = useDeepMemo(() => {
    return match<ItemEntity, string>(
      () => '-',
      (item) => DateTime.fromJSDate(item.updatedAt).toFormat('D t')
    )(selectedItem)
  }, [selectedItem])

  return (
    <div className="w-full">
      <div className="h-48 w-full">
        <ImageWithFallback className="object-cover w-full h-full" src={itemPictureSrc} />
      </div>
      <div className="pt-2 px-4">
        <div className="py-4">
          <GhostTextInput
            callback={(value) => {
              setUpdatedItem((prev) => {
                return {
                  ...prev,
                  name: value,
                }
              })
            }}
            value={itemName}
            className="text-xl"
            baseBlock="c-updateItemInputHeader"
            minLength={1}
            maxLength={20}
          ></GhostTextInput>
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col w-6/12">
            <div className="text-xs font-extralight py-2">ID</div>
            <div className="truncate text-sm">{itemID}</div>
          </div>
          <div className="flex flex-col w-6/12">
            <div className="text-xs font-extralight py-2 text-end">Updated At</div>
            <div className="truncate text-end text-sm">{itemUpdatedAt}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

const UpdateItemModalBody = ({
  updatedItem,
  setUpdatedItem,
}: {
  updatedItem: IItemUpdateParams
  setUpdatedItem: Dispatch<SetStateAction<IItemUpdateParams>>
}): JSX.Element => {
  const { selectedItem } = useAppContext()

  const itemQuantity = useDeepMemo(() => {
    return match<ItemEntity, number>(
      () => 0,
      (item) => updatedItem.quantity ?? item.quantity
    )(selectedItem)
  }, [selectedItem, updatedItem.quantity])

  const itemNote = useDeepMemo(() => {
    return match<ItemEntity, string>(
      () => '-',
      (item) =>
        match<string, string>(
          () => updatedItem.note ?? '-',
          (note) => updatedItem.note ?? note
        )(item.note)
    )(selectedItem)
  }, [selectedItem, updatedItem.note])

  const itemLocation = useDeepMemo(() => {
    return match<ItemEntity, string>(
      () => '-',
      (item) =>
        match<string, string>(
          () => updatedItem.location ?? '-',
          (location) => updatedItem.location ?? location
        )(item.location)
    )(selectedItem)
  }, [selectedItem, updatedItem.location])

  const itemUnit = useDeepMemo(() => {
    return match<ItemEntity, { unit: string; count: string; defaultCount: string }>(
      () => ({
        unit: '-',
        count: '0',
        defaultCount: '0',
      }),
      (item) => ({
        unit: item.unitName,
        count: formatInteger(item.unitKernelCount),
        defaultCount: formatInteger(item.quantityInDefaultFormat),
      })
    )(selectedItem)
  }, [selectedItem])

  return (
    <div className="pb-6 px-4 w-full">
      <div className="flex py-2 justify-between w-full">
        <div className="flex flex-col w-full">
          <div className="text-xs font-extralight py-2">Quantity</div>
          <GhostTextInput
            callback={(value) => {
              setUpdatedItem((prev) => {
                return {
                  ...prev,
                  quantity: parseInt(value),
                }
              })
            }}
            value={itemQuantity.toString()}
            className="text-sm"
            baseBlock="c-updateItemInputBody"
            type="number"
            min={0}
          ></GhostTextInput>
        </div>
        <div className="flex flex-col w-full">
          <div className="text-xs font-extralight py-2 text-end">Unit</div>
          <div className="truncate text-end text-sm">
            {itemUnit.count} {itemUnit.unit}{' '}
            <span className="text-xs font-light">
              (~{itemUnit.defaultCount} {DEFAULT_UNIT_NAME})
            </span>
          </div>
        </div>
      </div>
      <div className="flex py-2 justify-between w-full">
        <div className="flex flex-col w-full">
          <div className="text-xs font-extralight py-2">Note</div>
          <GhostTextInput
            callback={(value) => {
              setUpdatedItem((prev) => {
                return {
                  ...prev,
                  note: value,
                }
              })
            }}
            value={itemNote}
            className="text-sm"
            baseBlock="c-updateItemInputBody"
            minLength={1}
            maxLength={20}
          ></GhostTextInput>
        </div>
        <div className="flex flex-col w-full">
          <div className="text-xs font-extralight text-end py-2">Location</div>
          <GhostTextInput
            callback={(value) => {
              setUpdatedItem((prev) => {
                return {
                  ...prev,
                  location: value,
                }
              })
            }}
            value={itemLocation}
            className="text-sm w-full justify-end"
            baseBlock="c-updateItemInputBody"
            minLength={1}
            maxLength={20}
          ></GhostTextInput>
        </div>
      </div>
    </div>
  )
}

const UpdateItemModal = (): JSX.Element => {
  const { isUpdateItemModalOpen, setIsUpdateItemModalOpen, selectedItem, updateItem } = useAppContext()
  const [updatedItem, setUpdatedItem] = useState<IItemUpdateParams>({})
  const [isProceedModalOpen, setProceedItemModalOpen] = useState<boolean>(false)

  const hasUpdatedValue = useDeepMemo(() => {
    return isSome(selectedItem) && selectedItem.value.hasUpdatedValue(updatedItem)
  }, [updatedItem, selectedItem])

  const closeModal = useCallback((): void => {
    setIsUpdateItemModalOpen(false)
    startTransition(() => {
      setUpdatedItem({})
    })
  }, [setIsUpdateItemModalOpen])

  const openProceedItemModal = useCallback((): void => {
    setProceedItemModalOpen(true)
  }, [])

  const save = useDeepCallback(async () => {
    if (isSome(selectedItem)) {
      closeModal()
      await updateItem(selectedItem.value, updatedItem)
    }
  }, [selectedItem, updatedItem, updateItem, closeModal])

  return (
    <>
      <ProceedModal
        isProceedModalOpen={isProceedModalOpen}
        setIsProceedModalOpen={setProceedItemModalOpen}
        callback={closeModal}
        message="Are you sure you want to discard all changes?"
      ></ProceedModal>
      <Modal
        className="bg-base-100 text-base-content border-none"
        size="tiny"
        isOpen={isUpdateItemModalOpen}
        onDismiss={hasUpdatedValue ? openProceedItemModal : closeModal}
      >
        <ModalHeader
          title={
            <UpdateItemModalHeader updatedItem={updatedItem} setUpdatedItem={setUpdatedItem}></UpdateItemModalHeader>
          }
          onClose={hasUpdatedValue ? openProceedItemModal : closeModal}
        />
        <div className="divider"></div>
        <ModalContent>
          <UpdateItemModalBody updatedItem={updatedItem} setUpdatedItem={setUpdatedItem}></UpdateItemModalBody>
        </ModalContent>
        <ModalFooter>
          <div className="px-4 py-4 text-center">
            <button onClick={save} className="btn btn-wide btn-primary" disabled={!hasUpdatedValue}>
              Save
            </button>
          </div>
        </ModalFooter>
      </Modal>
    </>
  )
}

const ItemOptionsDropdownComponent = ({ item }: { item: ItemEntity }) => {
  const { setIsUpdateItemModalOpen, setSelectedItem } = useAppContext()
  const openUpdateItemModal = useDeepCallback((): void => {
    setIsUpdateItemModalOpen(true)
    setSelectedItem(some(item))
  }, [item, setIsUpdateItemModalOpen, setSelectedItem])
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
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}

const Home: NextPage = () => {
  const { itemsHookState, setIsUpdateQuantityModalOpen, setSelectedItem, atomItems } = useAppContext()

  const openUpdateQuantityModal = useCallback(
    (item: ItemEntity): void => {
      setIsUpdateQuantityModalOpen(true)
      setSelectedItem(some(item))
    },
    [setIsUpdateQuantityModalOpen, setSelectedItem]
  )

  if (itemsHookState.loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <div className="c-home w-screen tablet:max-w-screen-xl max-w-full px-4 mx-auto">
        <div className="c-home__header pt-12 pb-6 text-3xl font-bold justify-start">Items</div>
        <div className="c-home__content grid grid-cols-4 justify-items-center">
          {atomItems.map((item) => (
            <div key={item.id} className="c-home__item py-8">
              <div className="card card-compact h-72 w-60 bg-base-100 shadow-2xl shadow-black-500/40">
                <div className="w-full h-28">
                  <ImageWithFallback
                    className="object-cover w-full h-full"
                    src={`${process.env.WORK_TRIAL_API_URL}/images/${match(
                      () => '',
                      (pic) => pic
                    )(item.picture)}`}
                  />
                </div>
                <div className="card-body justify-between">
                  <div className="flex flex-col justify-between">
                    <div className="flex justify-between content-center">
                      <div className="text-xs font-light truncate w-9/12 items-center self-center">{item.id}</div>
                      <div className="cursor-pointer">
                        <ItemOptionsDropdownComponent item={item} />
                      </div>
                    </div>
                    <h2 className="card-title">{item.name}</h2>
                  </div>
                  <div className="card-actions flex justify-center">
                    <button
                      onClick={() => {
                        openUpdateQuantityModal(item)
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <div className=" btn-bloc flex">
                        <span className="text-xs pr-2">Update Quantity</span>{' '}
                        <span>
                          <PlusMinus />
                        </span>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <UpdateQuantityModal />
      <UpdateItemModal />
    </>
  )
}

export default Home
