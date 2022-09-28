import { isLeft } from 'fp-ts/lib/Either'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { apiItemAdapter } from '~/adapters/item/api'
import { IItemAdapter } from '~/adapters/item/interfaces'
import { itemEntitiesAtom } from '~/atom'
import { ItemEntity } from '~/entities'
import { IItemUpdateParams } from '~/entities/item/interfaces'
import { wrapErr } from '~/utils'

export const useUpdateItem = () => {
  const itemAdapter: IItemAdapter = apiItemAdapter
  const [, setItemEntitiesAtom] = useAtom(itemEntitiesAtom)

  return useCallback(
    async (selectedItem: ItemEntity, updatedParams: IItemUpdateParams) => {
      const result = await wrapErr(itemAdapter.updateItem(selectedItem.id, updatedParams))

      if (isLeft(result)) return

      const updatedItem = selectedItem.createUpdatedItemEntity(updatedParams)
      setItemEntitiesAtom((prev) => prev.map((item) => (item.id === updatedItem.id ? updatedItem : item)))
    },
    [itemAdapter, setItemEntitiesAtom]
  )
}
