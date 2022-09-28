import { isLeft } from 'fp-ts/lib/Either'
import { none } from 'fp-ts/lib/Option'
import { useAtom } from 'jotai'
import { useEffect, useState } from 'react'
import { apiItemAdapter } from '~/adapters/item/api'
import { IItemAdapter } from '~/adapters/item/interfaces'
import { itemEntitiesAtom } from '~/atom'
import { ItemEntity } from '~/entities'
import { wrapErr } from '~/utils'
import { IHookState } from '../interfaces'

export const useGetAllItems = () => {
  const itemAdapter: IItemAdapter = apiItemAdapter
  const [, setItemEntitiesAtom] = useAtom(itemEntitiesAtom)
  const [items, setItems] = useState<IHookState<Array<ItemEntity>>>({
    loading: true,
    error: none,
    refreshing: false,
    data: [],
  })

  useEffect(() => {
    const fetchItems = async () => {
      setItems((prevState) => ({
        ...prevState,
        refreshing: true,
      }))
      const result = await wrapErr(itemAdapter.getAllItems())
      if (isLeft(result)) {
        setItems((prevState) => ({
          ...prevState,
          refreshing: false,
        }))
        return
      }
      setItems({
        loading: false,
        error: none,
        refreshing: false,
        data: result.right as Array<ItemEntity>,
      })
      // eslint-disable-next-line no-param-reassign, @typescript-eslint/no-unused-vars
      setItemEntitiesAtom((draft) => (draft = result.right as Array<ItemEntity>))
    }

    fetchItems()
  }, [itemAdapter, setItemEntitiesAtom])

  return items
}
