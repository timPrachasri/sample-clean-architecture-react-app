import { DependencyList, EffectCallback, useEffect } from 'react'
import { useFirstMountState } from './useFirstMountState'

// Ref: https://github.com/streamich/react-use/blob/master/src/useUpdateEffect.ts
export const useUpdateEffect = (effect: EffectCallback, deps: DependencyList): void => {
  const isFirstMount = useFirstMountState()

  useEffect(
    () => {
      if (!isFirstMount) {
        return effect()
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    deps
  )
}
