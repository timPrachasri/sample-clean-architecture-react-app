import { ItemEntity } from '~/entities'
import { IHookState } from '~/hooks'
import { Option } from 'fp-ts/lib/Option'
import { IItemUpdateParams } from '~/entities/item/interfaces'

export interface IAppProviderContext {
  itemsHookState: IHookState<Array<ItemEntity>>
  atomItems: Array<ItemEntity>
  setSelectedItem: React.Dispatch<React.SetStateAction<Option<ItemEntity>>>
  selectedItem: Option<ItemEntity>
  isUpdateItemModalOpen: boolean
  setIsUpdateItemModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  isUpdateQuantityModalOpen: boolean
  setIsUpdateQuantityModalOpen: React.Dispatch<React.SetStateAction<boolean>>
  updateItem: (selectedItem: ItemEntity, updatedParams: IItemUpdateParams) => Promise<void>
}
