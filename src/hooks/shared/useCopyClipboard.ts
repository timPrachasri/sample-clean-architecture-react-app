import copy from 'copy-to-clipboard'
import { useCallback } from 'react'
import { IUseCopyClipboard } from '../interfaces'

export const useCopyClipboard = (): IUseCopyClipboard => {
  return useCallback((toCopy: string) => {
    return copy(toCopy)
  }, [])
}
