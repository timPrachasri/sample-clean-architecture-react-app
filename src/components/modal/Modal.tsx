import { Dialog, Transition } from '@headlessui/react'
import React, { Fragment, ReactNode, RefObject } from 'react'

interface IModalProps {
  children?: ReactNode
  isOpen: boolean
  onDismiss: () => void
  initialFocusRef?: RefObject<any>
  padding?: boolean
  noBorder?: boolean
  size?: IModalSize
}

type IModalSize = 'default' | 'large' | 'small' | 'tiny'

enum EnumModalSize {
  default = 'tablet:w-1/2 w-11/12 max-w-5xl',
  large = 'tablet:w-full w-11/12',
  small = 'tablet:w-1/2 w-11/12 max-w-2xl',
  tiny = 'tablet:w-1/3 w-11/12 max-w-xl',
}

export const Modal = ({
  children,
  isOpen,
  onDismiss,
  initialFocusRef,
  padding = false,
  noBorder = false,
  size = 'default',
  ...props
}: IModalProps & React.HTMLAttributes<HTMLDivElement>): JSX.Element => {
  const borderStyle = noBorder ? '' : 'border-primary-2 border-2'
  const paddingStyle = padding ? 'tablet:px-6 tablet:py-8 px-4 py-6' : 'p-0'

  return (
    <Transition.Root as={Fragment} show={isOpen}>
      <Dialog as="div" className="fixed z-90 inset-0" initialFocus={initialFocusRef} onClose={onDismiss}>
        <div className="flex flex-col items-center justify-center min-h-screen">
          <Transition.Child
            as={Fragment}
            enter="duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="absolute w-full h-full inset-0 bg-black bg-opacity-50" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-75"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-0"
          >
            <div
              className={`
              relative shadow-modal tablet:max-h-[90vh] max-h-[67vh] z-90 overflow-y-auto bg-tertiary-2 rounded-3xl ${paddingStyle} ${borderStyle} ${
                EnumModalSize[size]
              } ${props.className ?? ''} `}
            >
              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
