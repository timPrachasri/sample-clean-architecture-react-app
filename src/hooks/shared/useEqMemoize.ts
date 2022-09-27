import { EffectCallback, useCallback, useEffect, useMemo, useRef } from 'react'
import { dequal } from 'dequal'
import consola from 'consola'
import { IDeepHookOptions } from './interfaces'

// Use effect prior detail comes from https://github.com/kentcdodds/use-deep-compare-effect/blob/master/src/index.ts
export const useEqMemoize = <A extends ReadonlyArray<unknown>>(value: A, options?: IDeepHookOptions): Array<number> => {
  const ref = useRef<A>()
  const signalRef = useRef<number>(0)

  if (ref.current === null) {
    ref.current = value
  }

  if (!dequal(value, ref.current)) {
    if (options && options.debug) {
      // eslint-disable-next-line no-console
      consola.info('Stable hook update triggered:', { prev: ref.current, value: value })
    }
    ref.current = value
    signalRef.current += 1
  }
  return [signalRef.current]
}

export const useDeepEffect = <A extends ReadonlyArray<unknown>>(
  callback: EffectCallback,
  dependencies: A,
  options?: IDeepHookOptions
): ReturnType<typeof useEffect> => {
  return useEffect(callback, useEqMemoize(dependencies, options))
}

export const useDeepMemo = <A extends ReadonlyArray<unknown>, T>(
  factory: () => T,
  dependencies: A,
  options?: IDeepHookOptions
): T => {
  return useMemo(factory, useEqMemoize(dependencies, options))
}

export const useDeepCallback = <A extends ReadonlyArray<unknown>, T extends (...args: any[]) => any>(
  callback: T,
  dependencies: A,
  options?: IDeepHookOptions
): T => {
  return useCallback(callback, useEqMemoize(dependencies, options))
}
