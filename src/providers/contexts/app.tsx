import { isNone, none, Option, some } from 'fp-ts/lib/Option'
import { useAtomValue } from 'jotai'
import React, { createContext, ReactNode, useContext } from 'react'
import { itemEntitiesAtom } from '~/atom'
import { ItemEntity } from '~/entities'
import { useGetAllItems, useUpdateItem } from '~/hooks/items'
import { useCreateItem } from '~/hooks/items/useCreateItem'
import { IAppProviderContext } from './interfaces'

const AppProviderContext = createContext<Option<IAppProviderContext>>(none)

export const AppProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const itemsHookState = useGetAllItems()
  const updateItem = useUpdateItem()
  const createItem = useCreateItem()
  const atomItems = useAtomValue(itemEntitiesAtom)
  const [selectedItem, setSelectedItem] = React.useState<Option<ItemEntity>>(none)
  const [isUpdateItemModalOpen, setIsUpdateItemModalOpen] = React.useState(false)
  const [isUpdateQuantityModalOpen, setIsUpdateQuantityModalOpen] = React.useState(false)
  const [isCreateItemModalOpen, setIsCreateItemModalOpen] = React.useState(false)

  return (
    <AppProviderContext.Provider
      value={some({
        itemsHookState,
        atomItems,
        setSelectedItem,
        selectedItem,
        isUpdateItemModalOpen,
        setIsUpdateItemModalOpen,
        isUpdateQuantityModalOpen,
        setIsUpdateQuantityModalOpen,
        isCreateItemModalOpen,
        setIsCreateItemModalOpen,
        updateItem,
        createItem,
      })}
    >
      {children}
    </AppProviderContext.Provider>
  )
}

export const useAppContext = (): IAppProviderContext => {
  const context = useContext(AppProviderContext)
  if (isNone(context)) {
    throw new Error('AppProviderContext must be initialized')
  }
  return context.value
}

export default AppProvider
