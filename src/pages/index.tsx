import { isSome, some } from 'fp-ts/lib/Option'
import type { NextPage } from 'next'
import React, { useCallback } from 'react'
import { useAppContext } from '~/providers'

import { ItemEntity } from '~/entities'
import { UpdateItemModal, UpdateQuantityModal, ItemCard, CreateItemModal, AddItemCard } from '~/components/item'
import { ProceedModal } from '~/components/modal'

const Home: NextPage = () => {
  const {
    itemsHookState,
    setIsUpdateQuantityModalOpen,
    setSelectedItem,
    atomItems,
    setIsCreateItemModalOpen,
    isDeleteItemModalOpen,
    setIsDeleteItemModalOpen,
    deleteItem,
    selectedItem,
  } = useAppContext()

  const openUpdateQuantityModal = useCallback(
    (item: ItemEntity): void => {
      setIsUpdateQuantityModalOpen(true)
      setSelectedItem(some(item))
    },
    [setIsUpdateQuantityModalOpen, setSelectedItem]
  )

  const openCreateModal = useCallback((): void => {
    setIsCreateItemModalOpen(true)
  }, [setIsCreateItemModalOpen])

  return (
    <>
      <div className="c-home w-screen tablet:max-w-screen-xl min-h-screen max-w-full px-4 mx-auto">
        <div className="c-home__header pt-12 pb-6 text-3xl font-bold justify-start">Items</div>
        <div className="c-home__content grid grid-cols-4 justify-items-center">
          {!itemsHookState.loading &&
            atomItems.map((item) => (
              <div key={item.id} className="c-home__item py-8">
                <ItemCard
                  item={item}
                  onClick={() => {
                    openUpdateQuantityModal(item)
                  }}
                ></ItemCard>
              </div>
            ))}
          <div className="c-home__item py-8">
            <AddItemCard onClick={openCreateModal}></AddItemCard>
          </div>
        </div>
      </div>
      <CreateItemModal />
      <UpdateQuantityModal />
      <UpdateItemModal />
      <ProceedModal
        isProceedModalOpen={isDeleteItemModalOpen}
        setIsProceedModalOpen={setIsDeleteItemModalOpen}
        callback={() => {
          if (isSome(selectedItem)) {
            deleteItem(selectedItem.value)
          }
        }}
        message="Are you sure you want to delete the item?"
      ></ProceedModal>
    </>
  )
}

export default Home
