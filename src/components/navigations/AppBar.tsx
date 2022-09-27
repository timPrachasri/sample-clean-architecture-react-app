import { Disclosure } from '@headlessui/react'
import Image from 'next/image'
import React from 'react'
import styled from 'styled-components'
import tw from 'twin.macro'
import Logo from '../../../public/images/logo.svg'
import { CloseIcon, MenuIcon } from '../icons'

interface IMenu {
  id: string
  label: string
  to: string
}

const LogoWrapper = styled.div`
  width: 68px;
  height: 18px;
  @media screen and (min-width: 600px) {
    & {
      width: 120px;
      height: 52px;
    }
  }
  ${() => tw`sm:flex relative flex items-center sm:mr-14 whitespace-nowrap cursor-pointer`};
`

export const AppBar = (): JSX.Element => {
  const navClassList =
    'w-full tablet:max-w-screen-xl max-w-full px-4 mx-auto bg-transparent gradient-border-bottom z-10'

  return (
    <header className="c-appbar top-0 flex z-80 sticky">
      <nav className="c-appbar__nav flex flex-row flex-nowrap justify-between w-screen bg-secondary">
        <Disclosure as="div" className={navClassList}>
          <div className="c-appbar__nav--desktop tablet:px-0 px-4 py-4 flex items-center justify-between">
            <div className="flex items-center">
              <LogoWrapper>
                <Image layout="fill" objectFit="contain" src={Logo} />
              </LogoWrapper>
            </div>
          </div>
        </Disclosure>
      </nav>
    </header>
  )
}
