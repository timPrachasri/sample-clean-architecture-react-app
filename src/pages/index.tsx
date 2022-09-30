import { isSome, some } from 'fp-ts/lib/Option'
import type { NextPage } from 'next'
import React, { useCallback } from 'react'
import { useAppContext } from '~/providers'

import { ItemEntity } from '~/entities'
import { UpdateItemModal, UpdateQuantityModal, ItemCard, CreateItemModal, AddItemCard } from '~/components/item'
import { ProceedModal } from '~/components/modal'
import { DEFAULT_UNIT_NAME } from '~/constants'
import { useDeepMemo } from '~/hooks'
import { formatInteger } from '~/utils/common/format'

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
    downloadItems,
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

  const totalDefaultUnitQuantity = useDeepMemo(() => {
    return atomItems.reduce((accum, item) => {
      return accum + item.quantityInDefaultFormat
    }, 0)
  }, [atomItems])

  return (
    <>
      <div className="c-home w-screen tablet:max-w-screen-xl min-h-screen max-w-full px-4 mx-auto">
        <div className="c-home__header pt-12 pb-6 text-3xl font-bold justify-start">Corn Retail Inventory 🌽</div>
        {!itemsHookState.loading &&
          (atomItems.length == 0 ? (
            <div className="hero min-h-screen bg-accent">
              <div className="hero-content text-center">
                <div className="max-w-md">
                  <h1 className="text-5xl font-bold">Howdy!</h1>
                  <p className="py-6">
                    It seems like you haven&apos;t added any items yet. Click the button below to add your first item.
                  </p>
                  <button className="btn btn-primary" onClick={openCreateModal}>
                    Add Item
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="pt-4 pb-8">
                <div className="stats bg-primary text-primary-content">
                  <div className="stat">
                    <div className="stat-title">Total {DEFAULT_UNIT_NAME}(s)</div>
                    <div className="stat-value">{formatInteger(totalDefaultUnitQuantity)}</div>
                    <div className="stat-actions">
                      <button className="btn btn-success" onClick={openCreateModal}>
                        Add Item
                      </button>
                    </div>
                  </div>

                  <div className="stat">
                    <button className="btn btn-sm btn-success" onClick={downloadItems}>
                      Export Items To CSV
                    </button>
                  </div>
                </div>
              </div>
              <div className="divider"></div>
            </>
          ))}
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
          {!itemsHookState.loading && atomItems.length > 0 && (
            <div className="c-home__item py-8">
              <AddItemCard onClick={openCreateModal}></AddItemCard>
            </div>
          )}
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
