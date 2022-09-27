import { DeviceType } from './interfaces'

/**
 * It detects the device type of the user based on the user agent.
 * @param context - { req: { headers: { [x: string]: any } } }
 * @returns A `DeviceType` enum.
 */
export const detectDeviceTypeSSR = (context: { req: { headers: { [x: string]: any } } }): DeviceType => {
  const UA = context.req.headers['user-agent']
  const isMobile = !!/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(UA)

  return isMobile ? DeviceType.MOBILE : DeviceType.DESKTOP
}
