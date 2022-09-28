import { Dialog } from '@headlessui/react'
import React, { ReactNode } from 'react'
import { CloseIcon } from '../icons'

interface IModalHeaderProps {
  title?: string | ReactNode
  onClose?: () => void
  padding?: boolean
}

export const ModalHeader = ({ title, onClose, padding = false }: IModalHeaderProps): JSX.Element => {
  return (
    <Dialog.Title className={`relative ${padding ? 'p-6' : 'p-0'}`}>
      <div className="flex items-center justify-between gap-5">
        {title || <span />}
        {onClose && <CloseIcon className="absolute tablet:top-6 top-3 tablet:right-6 right-3" onClick={onClose} />}
      </div>
    </Dialog.Title>
  )
}
