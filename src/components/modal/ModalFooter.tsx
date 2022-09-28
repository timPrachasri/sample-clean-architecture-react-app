import React, { ReactNode } from 'react'

interface IModalFooterProps {
  children: ReactNode
}

export const ModalFooter = ({ children }: IModalFooterProps): JSX.Element => {
  return <footer>{children}</footer>
}
