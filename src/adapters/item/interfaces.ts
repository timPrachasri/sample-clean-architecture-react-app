import { ItemEntity } from '~/entities/item'
import { IItemCreateParams, IItemUpdateParams } from '~/entities/item/interfaces'

export interface IItemAdapter {
  getAllItems: () => Promise<Array<ItemEntity>>
  updateItem: (id: string, params: IItemUpdateParams) => Promise<void>
  createItem: (params: IItemCreateParams) => Promise<void>
}
