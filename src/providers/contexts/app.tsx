import { isNone, none, Option, some } from 'fp-ts/lib/Option'
import React, { createContext, ReactNode, useCallback, useContext, useState } from 'react'
import { IAppProviderContext } from './interfaces'

const AppProviderContext = createContext<Option<IAppProviderContext>>(none)

export const AppProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  /**
   * we can't define @param {Dialog} - as a child of @param {Disclosure}
   * then we need some provider to pass some states to @param {Dialog}
   */
  const [isWalletModalOpen, setIsWalletModelOpen] = useState<boolean>(false)
  const handleIsWalletModalOpen = useCallback((v: boolean) => setIsWalletModelOpen(v), [setIsWalletModelOpen])

  return (
    <AppProviderContext.Provider value={some({ isWalletModalOpen, handleIsWalletModalOpen })}>
      {children}
    </AppProviderContext.Provider>
  )
}

export const useAppContext = (): IAppProviderContext => {
  const context = useContext(AppProviderContext)
  if (isNone(context)) {
    throw new Error('AppProviderContext must be initialized')
  }
  return context.value
}

export default AppProvider
