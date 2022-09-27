import { Option } from 'fp-ts/lib/Option'

export type IUseCopyClipboard = (toCopy: string) => boolean
export type IUseLocalStorage<T> = [Option<T>, (value: T) => void]
export type IUseToggle = [boolean, () => void]

export type IUndefinable<T> = T | undefined

export interface IHookState<T> {
  data: T
  loading: boolean
  error: Option<Error>
  refreshing?: boolean
}

export interface IDeepHookOptions {
  debug: boolean
}
