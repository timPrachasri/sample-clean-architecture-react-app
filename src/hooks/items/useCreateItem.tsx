import { isLeft } from 'fp-ts/lib/Either'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { apiItemAdapter } from '~/adapters/item/api'
import { IItemAdapter } from '~/adapters/item/interfaces'
import { itemEntitiesAtom } from '~/atom'
import { ItemEntity } from '~/entities'
import { IItemCreateParams } from '~/entities/item/interfaces'
import { wrapErr } from '~/utils'

export const useCreateItem = () => {
  const itemAdapter: IItemAdapter = apiItemAdapter
  const [, setItemEntitiesAtom] = useAtom(itemEntitiesAtom)

  return useCallback(
    async (createParams: IItemCreateParams) => {
      const result = await wrapErr(itemAdapter.createItem(createParams))

      if (isLeft(result)) return

      const items = await wrapErr(itemAdapter.getAllItems())

      if (isLeft(items)) return

      // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-unused-vars
      setItemEntitiesAtom((prev) => (prev = items.right as Array<ItemEntity>))
    },
    [itemAdapter, setItemEntitiesAtom]
  )
}
