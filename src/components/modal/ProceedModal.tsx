import React from 'react'
import { Modal } from './Modal'
import { ModalContent } from './ModalContent'
import { ModalHeader } from './ModalHeader'

export const ProceedModal = ({
  isProceedModalOpen,
  setIsProceedModalOpen,
  callback,
  message,
}: {
  isProceedModalOpen: boolean
  setIsProceedModalOpen: (value: React.SetStateAction<boolean>) => void
  callback: () => void
  message?: string
}): JSX.Element => {
  const closeAndProceedModal = (): void => {
    setIsProceedModalOpen(false)
    callback()
  }

  const closeModal = (): void => {
    setIsProceedModalOpen(false)
  }

  return (
    <>
      <Modal
        className="bg-base-100 z-99 text-base-content border-none"
        size="tiny"
        onDismiss={closeModal}
        isOpen={isProceedModalOpen}
      >
        <ModalHeader
          title={
            <div className="pt-2 px-4">
              <div className="py-4">{message ?? 'Are you sure you want to proceed?'}</div>
            </div>
          }
          onClose={closeModal}
        />
        <ModalContent>
          <div className="pb-6 px-4 w-full flex justify-around">
            <button className="btn btn-primary" onClick={() => setIsProceedModalOpen(false)}>
              Cancel
            </button>
            <button className="btn btn-primary " onClick={closeAndProceedModal}>
              Proceed
            </button>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}
