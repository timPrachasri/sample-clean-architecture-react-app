import { isLeft } from 'fp-ts/lib/Either'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { apiItemAdapter } from '~/adapters/item/api'
import { IItemAdapter } from '~/adapters/item/interfaces'
import { itemEntitiesAtom } from '~/atom'
import { ItemEntity } from '~/entities'
import { wrapErr } from '~/utils'

export const useDeleteItem = () => {
  const itemAdapter: IItemAdapter = apiItemAdapter
  const [, setItemEntitiesAtom] = useAtom(itemEntitiesAtom)

  return useCallback(
    async (selectedItem: ItemEntity) => {
      const result = await wrapErr(itemAdapter.deleteItem(selectedItem.id))

      if (isLeft(result)) return

      setItemEntitiesAtom((prev) => prev.filter((item) => item.id !== selectedItem.id))
    },
    [itemAdapter, setItemEntitiesAtom]
  )
}
