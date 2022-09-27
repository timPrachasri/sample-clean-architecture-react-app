import React, { createContext, ReactNode, useContext } from 'react'
import { isMobile } from 'react-device-detect'
import { DeviceType } from '~/utils/common/interfaces'

const DeviceProviderContext = createContext<DeviceType>(DeviceType.DESKTOP)

export const DeviceProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const deviceType = isMobile ? DeviceType.MOBILE : DeviceType.DESKTOP

  return <DeviceProviderContext.Provider value={deviceType}>{children}</DeviceProviderContext.Provider>
}

export const useDeviceContext = (): DeviceType => {
  const context = useContext(DeviceProviderContext)

  return context
}

export default DeviceProvider
