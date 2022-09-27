import { useRef } from 'react'

// Ref: https://github.com/streamich/react-use/blob/master/src/useFirstMountState.ts
export const useFirstMountState = (): boolean => {
  const isFirst = useRef(true)

  if (isFirst.current) {
    isFirst.current = false

    return true
  }

  return isFirst.current
}
