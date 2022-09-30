import React, { startTransition, useCallback } from 'react'
import { isSome, match } from 'fp-ts/lib/Option'
import { DateTime } from 'luxon'
import { Dispatch, SetStateAction, useState } from 'react'
import { ImageWithFallback } from '~/components/image/ImageWithFallback'
import { GhostTextInput } from '~/components/input'
import { ItemEntity } from '~/entities'
import { IItemUpdateParams } from '~/entities/item/interfaces'
import { useDeepCallback, useDeepMemo } from '~/hooks'
import { useAppContext } from '~/providers'
import { formatInteger } from '~/utils/common/format'
import { ProceedModal, Modal, ModalContent, ModalHeader, ModalFooter } from '~/components/modal'
import { DEFAULT_UNIT_NAME } from '~/constants'

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
        count: formatInteger(item.quantity),
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
            <span className="text-xs font-light">(~{itemUnit.defaultCount} Kernel)</span>
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

export const UpdateItemModal = (): JSX.Element => {
  const { isUpdateItemModalOpen, setIsUpdateItemModalOpen, selectedItem, updateItem } = useAppContext()
  const [updatedItem, setUpdatedItem] = useState<IItemUpdateParams>({})
  const [isProceedModalOpen, setProceedItemModalOpen] = useState<boolean>(false)

  const hasUpdatedValue = useDeepMemo(() => {
    return isSome(selectedItem) && selectedItem.value.hasUpdatedValue(updatedItem)
  }, [updatedItem, selectedItem])

  const dismissModal = useCallback((): void => {
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
      setIsUpdateItemModalOpen(false)
      await updateItem(selectedItem.value, updatedItem)
    }
  }, [selectedItem, updatedItem, updateItem, setIsUpdateItemModalOpen])

  return (
    <>
      <ProceedModal
        isProceedModalOpen={isProceedModalOpen}
        setIsProceedModalOpen={setProceedItemModalOpen}
        callback={dismissModal}
        message="Are you sure you want to discard all changes?"
      ></ProceedModal>
      <Modal
        className="bg-base-100 text-base-content border-none"
        size="tiny"
        isOpen={isUpdateItemModalOpen}
        onDismiss={hasUpdatedValue ? openProceedItemModal : dismissModal}
      >
        <ModalHeader
          title={
            <UpdateItemModalHeader updatedItem={updatedItem} setUpdatedItem={setUpdatedItem}></UpdateItemModalHeader>
          }
          onClose={hasUpdatedValue ? openProceedItemModal : dismissModal}
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
