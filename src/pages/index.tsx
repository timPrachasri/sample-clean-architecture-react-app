import type { NextPage } from 'next'
import React from 'react'
import DeviceProvider from '~/providers/contexts/device'

const Home: NextPage = () => {
  return (
    <DeviceProvider>
      <div className="c-dashboard w-screen tablet:max-w-screen-xl max-w-full px-4 mx-auto"></div>
    </DeviceProvider>
  )
}

export default Home
