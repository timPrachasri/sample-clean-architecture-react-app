import { pipe } from 'fp-ts/lib/function'
import { fromNullable, getOrElse, match, none, Option, some } from 'fp-ts/lib/Option'
import { DateTime } from 'luxon'
import { DEFAULT_UNIT_KERNEL_COUNT } from '~/constants'
import { Entity } from '~/utils'
import { IItemProps, IItemUpdateParams } from './interfaces'

export class ItemEntity extends Entity<IItemProps> {
  constructor(props: IItemProps) {
    super(props)
  }

  get id(): string {
    return this.props.id
  }

  get name(): string {
    return this.props.name
  }

  get unitName(): string {
    return this.props.unit.name
  }

  get unitKernelCount(): number {
    return this.props.unit.kernelCount
  }

  get updatedAt(): Date {
    return pipe(
      fromNullable(this.props.updatedAt),
      getOrElse(() => DateTime.utc().toJSDate())
    )
  }

  get createdAt(): Date {
    return pipe(
      fromNullable(this.props.createdAt),
      getOrElse(() => DateTime.utc().toJSDate())
    )
  }

  get quantity(): number {
    return this.props.quantity
  }

  get location(): Option<string> {
    return fromNullable(this.props.location)
  }

  get picture(): Option<string> {
    return pipe(
      fromNullable(this.props.picture),
      match(
        () => none,
        () => {
          if (new RegExp('p_').test(this.props.picture as string)) {
            return some(this.props.picture as string)
          }
          const type = (this.props.picture as string).split(';')[0].split('/')[1]
          return some(`p_${DateTime.utc().toUnixInteger()}.${type}`)
        }
      )
    )
  }

  get note(): Option<string> {
    return fromNullable(this.props.note)
  }

  get quantityInDefaultFormat(): number {
    return parseFloat((this.props.unit.kernelCount * this.props.quantity).toFixed(2))
  }

  public cleanUpdatedValue(params: IItemUpdateParams): IItemUpdateParams {
    const updatedField: IItemUpdateParams = {}
    if (params.name) {
      updatedField.name = this.props.name === params.name ? undefined : params.name
    }
    if (params.quantity) {
      updatedField.quantity = this.props.quantity === params.quantity ? undefined : params.quantity
    }
    if (params.location) {
      updatedField.location = this.props.location === params.location ? undefined : params.location
    }
    if (params.picture) {
      updatedField.picture = this.props.picture === params.picture ? undefined : params.picture
    }
    if (params.note) {
      updatedField.note = this.props.note === params.note ? undefined : params.note
    }
    return updatedField
  }

  public hasUpdatedValue(params: IItemUpdateParams): boolean {
    return Object.values(this.cleanUpdatedValue(params)).some((value) => value !== undefined)
  }

  public createUpdatedItemEntity(params: IItemUpdateParams): ItemEntity {
    return new ItemEntity({
      ...this.props,
      ...params,
      unit: {
        ...this.props.unit,
      },
      updatedAt: DateTime.utc().toJSDate(),
    })
  }

  public static create(props: IItemProps): ItemEntity {
    return new ItemEntity(props)
  }
}
