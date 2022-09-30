import { useCallback } from 'react'
import { apiItemAdapter } from '~/adapters/item/api'
import { IItemAdapter } from '~/adapters/item/interfaces'

export const useDownloadItems = () => {
  const itemAdapter: IItemAdapter = apiItemAdapter

  return useCallback(async () => {
    await itemAdapter.download()
  }, [itemAdapter])
}
