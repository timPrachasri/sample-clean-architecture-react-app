import React, { SVGProps } from 'react'
import { AlertTriangle, Info, Menu, X, ChevronLeft, MoreHorizontal, Plus, Minus, Edit } from 'react-feather'
import styled from 'styled-components'

export const CloseIcon = styled(X)`
  cursor: pointer;
`

export const MenuIcon = styled(Menu)`
  cursor: pointer;
`

export const WarningIcon = styled(AlertTriangle)``

export const InfoIcon = styled(Info)``

export const ChevronLeftIcon = styled(ChevronLeft)``

export const MoreHorizontalIcon = styled(MoreHorizontal)``

export const PlusIcon = styled(Plus)``

export const MinusIcon = styled(Minus)``

export const EditInactiveIcon = (props: SVGProps<any>) => {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 13V16H7L16 7L13 4L4 13Z" fill="#EDE9FE" stroke="#529B03" strokeWidth="2" />
    </svg>
  )
}

export const EditActiveIcon = (props: SVGProps<any>) => {
  return (
    <svg {...props} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M4 13V16H7L16 7L13 4L4 13Z" fill="#3F7802" stroke="#529B03" strokeWidth="2" />
    </svg>
  )
}
