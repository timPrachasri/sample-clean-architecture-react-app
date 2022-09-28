import React, { ReactNode } from 'react'

export const ModalContent = ({ children }: { children: ReactNode }): JSX.Element => {
  return <div className="flex flex-grow">{children}</div>
}
