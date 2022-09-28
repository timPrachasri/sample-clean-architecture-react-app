import { map } from 'fp-ts/lib/Array'
import { DateTime } from 'luxon'
import { httpService } from '~/connectors'
import { ItemEntity } from '~/entities'
import { IItemUpdateParams } from '~/entities/item/interfaces'
import { IItemAdapter } from '../interfaces'
import { IGetAllItemsResponse, IGetItemResponse } from './interfaces'

export class APIItemAdapter implements IItemAdapter {
  async getAllItems(): Promise<Array<ItemEntity>> {
    const items = await httpService.get<IGetAllItemsResponse>('/api/v1/items')
    return map((response: IGetItemResponse) => {
      return new ItemEntity({
        id: response.id,
        name: response.name,
        unit: {
          name: response.unit.name,
          kernelCount: response.unit.kernelCount,
        },
        quantity: response.quantity,
        location: response.location,
        picture: response.picture,
        note: response.note,
        updatedAt: DateTime.fromISO(response.updatedAt as string)
          .toLocal()
          .toJSDate(),
        createdAt: DateTime.fromISO(response.createdAt as string)
          .toLocal()
          .toJSDate(),
      })
    })(items.data.data)
  }

  async updateItem(id: string, params: IItemUpdateParams): Promise<void> {
    await httpService.patch(`/api/v1/items/${id}`, {
      ...(params.name ? { name: params.name } : {}),
      ...(params.quantity ? { quantity: params.quantity } : {}),
      ...(params.location ? { location: params.location } : {}),
      ...(params.picture ? { picture: params.picture } : {}),
      ...(params.note ? { note: params.note } : {}),
    })
  }
}

export const apiItemAdapter = new APIItemAdapter()
