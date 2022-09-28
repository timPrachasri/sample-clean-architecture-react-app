import { atomWithImmer } from 'jotai/immer'
import { ItemEntity } from '~/entities'

export const itemEntitiesAtom = atomWithImmer<Array<ItemEntity>>([])
