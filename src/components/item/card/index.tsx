import { match } from 'fp-ts/lib/Option'
import React from 'react'
import { ImageWithFallback } from '~/components/image/ImageWithFallback'
import { ItemEntity } from '~/entities'
import { ItemOptionsDropdownComponent } from '../dropdown'
import PlusMinus from '../../../../public/svgs/plus-minus.svg'
import { PlusIcon } from '~/components/icons'

export const AddItemCard = ({ onClick }: { onClick: () => void }): JSX.Element => {
  return (
    <div onClick={onClick} className="card card-compact h-72 w-60 bg-base-100 shadow-2xl shadow-black-500/40">
      <div className="flex flex-col justify-center h-full items-center w-full bg-primary rounded-3xl border-2 border-accent border-dashed cursor-pointer hover:bg-primary-focus">
        <PlusIcon className="w-20 h-20"></PlusIcon>
      </div>
    </div>
  )
}

export const ItemCard = ({ item, onClick }: { item: ItemEntity; onClick: () => void }): JSX.Element => {
  return (
    <div className="card card-compact h-72 w-60 bg-base-100 shadow-2xl shadow-black-500/40">
      <div className="w-full h-28">
        <ImageWithFallback
          className="object-cover w-full h-full"
          src={`${process.env.WORK_TRIAL_API_URL}/images/${match(
            () => '',
            (pic) => pic
          )(item.picture)}`}
        />
      </div>
      <div className="card-body justify-between">
        <div className="flex flex-col justify-between">
          <div className="flex justify-between content-center">
            <div className="text-xs font-light truncate w-9/12 items-center self-center">{item.id}</div>
            <div className="cursor-pointer">
              <ItemOptionsDropdownComponent item={item} />
            </div>
          </div>
          <h2 className="card-title">{item.name}</h2>
        </div>
        <div className="card-actions flex justify-center">
          <button onClick={onClick} className="btn btn-primary btn-sm">
            <div className=" btn-bloc flex">
              <span className="text-xs pr-2">Update Quantity</span>{' '}
              <span>
                <PlusMinus />
              </span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
