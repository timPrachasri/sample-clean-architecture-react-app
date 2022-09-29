import { isSome, match } from 'fp-ts/lib/Option'
import React, { startTransition, useCallback, useState } from 'react'
import { GhostTextInput } from '~/components/input'
import { Modal, ModalContent, ModalFooter, ModalHeader, ProceedModal } from '~/components/modal'
import { ItemEntity } from '~/entities'
import { IItemUpdateParams } from '~/entities/item/interfaces'
import { useDeepCallback, useDeepMemo } from '~/hooks'
import { useAppContext } from '~/providers'

export const UpdateQuantityModal = (): JSX.Element => {
  const { isUpdateQuantityModalOpen, setIsUpdateQuantityModalOpen, selectedItem, updateItem } = useAppContext()
  const [updatedItem, setUpdatedItem] = useState<IItemUpdateParams>({})
  const [isProceedModalOpen, setProceedItemModalOpen] = useState<boolean>(false)
  const [counter, setCounter] = useState<number>(0)

  const hasUpdatedValue = useDeepMemo(() => {
    return isSome(selectedItem) && selectedItem.value.hasUpdatedValue(updatedItem)
  }, [updatedItem, selectedItem])

  const dismissModal = useCallback((): void => {
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
      setIsUpdateQuantityModalOpen(false)
      setCounter(0)
      await updateItem(selectedItem.value, updatedItem)
    }
  }, [selectedItem, updatedItem, updateItem, setCounter, setIsUpdateQuantityModalOpen])

  return (
    <>
      <ProceedModal
        isProceedModalOpen={isProceedModalOpen}
        setIsProceedModalOpen={setProceedItemModalOpen}
        callback={dismissModal}
        message="Are you sure you want to discard all changes?"
      ></ProceedModal>
      <Modal
        className="bg-base-100 z-99 text-base-content border-none"
        size="tiny"
        onDismiss={hasUpdatedValue ? openProceedItemModal : dismissModal}
        isOpen={isUpdateQuantityModalOpen}
      >
        <ModalHeader
          title={
            <div className="pt-2 px-4">
              <div className="py-4 text-xl font-bold">Adjust Quantity</div>
            </div>
          }
          onClose={hasUpdatedValue ? openProceedItemModal : dismissModal}
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
