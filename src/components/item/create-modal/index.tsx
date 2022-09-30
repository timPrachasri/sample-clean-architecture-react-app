import React, { startTransition, useCallback, useMemo } from 'react'
import { useState } from 'react'
import { useDeepCallback, useDeepEffect } from '~/hooks'
import { useAppContext } from '~/providers'
import { ProceedModal, Modal, ModalContent, ModalHeader, ModalFooter } from '~/components/modal'
import { DEFAULT_UNIT_KERNEL_COUNT, DEFAULT_UNIT_NAME } from '~/constants'
import { Formik, Form, useField, FieldAttributes } from 'formik'
import { createItemFormValuesSchema, ICreateItemFormValues } from './interfaces'

const TextInput = ({ ...props }: FieldAttributes<any>) => {
  const [field, meta] = useField(props)
  return (
    <>
      <input
        className="text-xl caret-base-content
            input input-bordered input-primary
            input-sm"
        {...field}
        {...props}
      />
      <div className="text-error-content text-sm">
        {meta.touched && meta.error ? <div className="error">{meta.error}</div> : null}
      </div>
    </>
  )
}

const ImageInput = ({ callback, ...props }: FieldAttributes<any> & { callback: (iamge: File) => void }) => {
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      callback(file)
    }
  }

  return (
    <>
      <input
        className="text-xl caret-base-content
            input input-bordered input-primary
            input-sm"
        {...props}
        accept="image/*"
        onChange={onFileChange}
      />
    </>
  )
}

const CreateItemModalHeader = ({
  image,
  setImage,
}: {
  image: File | null
  setImage: React.Dispatch<React.SetStateAction<File | null>>
}): JSX.Element => {
  const imageURL = useMemo(() => {
    if (image) {
      return URL.createObjectURL(image)
    }
    return ''
  }, [image])

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="flex justify-center items-center w-full">
          <label
            htmlFor="dropzone-file"
            className="flex flex-col justify-center items-center w-full h-64 bg-primary rounded-3xl border-2 border-accent border-dashed cursor-pointer hover:bg-primary-focus"
          >
            {image ? (
              <img className="object-cover w-full h-full" src={imageURL} />
            ) : (
              <div className="flex flex-col justify-center items-center pt-5 pb-6">
                <svg
                  aria-hidden="true"
                  className="mb-3 w-10 h-10 text-base-100"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  ></path>
                </svg>
                <p className="mb-2 text-sm text-base-100">
                  <span className="font-semibold">Click to upload</span> or drag and drop
                </p>
              </div>
            )}

            <ImageInput id="dropzone-file" type="file" className="hidden" callback={setImage} />
          </label>
        </div>
      </div>
      <div className="pt-2 px-4 w-full">
        <div className="py-2 flex flex-col w-full">
          <div className="text-xs font-extralight py-2">Name</div>
          <TextInput name="name" type="text"></TextInput>
        </div>
      </div>
    </div>
  )
}

const CreateItemModalBody = (): JSX.Element => {
  return (
    <div className="pb-6 px-4 w-full">
      <div className="flex py-2 justify-between flex-col w-full">
        <div className="flex flex-col w-full">
          <div className="text-xs font-extralight py-2">Quantity</div>
          <TextInput name="quantity" type="number"></TextInput>
        </div>
        <div className="flex flex-col w-full">
          <div className="text-xs font-extralight pt-2 ">Unit</div>
          <div className="flex justify-between">
            <div>
              <div className="text-[10px] font-extralight">Name</div>
              <TextInput name="unitName" type="text"></TextInput>
            </div>
            <div>
              <div className="text-[10px] font-extralight">Kernels Per Unit</div>
              <TextInput name="unitKernelCount" type="number"></TextInput>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full">
        <div className="text-xs font-extralight py-2">Note</div>
        <TextInput name="note" type="text"></TextInput>
      </div>
      <div className="flex flex-col w-full">
        <div className="text-xs font-extralight py-2">Location</div>
        <TextInput name="location" type="text"></TextInput>
      </div>
    </div>
  )
}

export const CreateItemModal = (): JSX.Element => {
  const { isCreateItemModalOpen, setIsCreateItemModalOpen, createItem } = useAppContext()
  const [isProceedModalOpen, setProceedItemModalOpen] = useState<boolean>(false)
  const [image, setImage] = useState<File | null>(null)
  const [imageB64, setImageB64] = useState<string | null>(null)
  const initialValues: ICreateItemFormValues = {
    name: '',
    unitName: DEFAULT_UNIT_NAME,
    unitKernelCount: DEFAULT_UNIT_KERNEL_COUNT,
    quantity: 1,
    location: undefined,
    note: undefined,
  }

  const dismissModal = useCallback((): void => {
    setIsCreateItemModalOpen(false)
  }, [setIsCreateItemModalOpen])

  const openProceedItemModal = useCallback((): void => {
    setProceedItemModalOpen(true)
  }, [])

  useDeepEffect(() => {
    if (image) {
      const reader = new FileReader()
      reader.onload = function () {
        setImageB64(reader.result as string)
      }
      reader.readAsDataURL(image)
    }
  }, [image])

  const create = useCallback(
    async (values: ICreateItemFormValues & { picture?: string }) => {
      setIsCreateItemModalOpen(false)
      await createItem({
        name: values.name,
        unit: {
          name: values.unitName,
          kernelCount: values.unitKernelCount,
        },
        quantity: values.quantity,
        location: values.location,
        note: values.note,
        picture: values.picture,
      })
    },
    [setIsCreateItemModalOpen, createItem]
  )

  return (
    <>
      <Formik
        initialValues={initialValues}
        validationSchema={createItemFormValuesSchema}
        onSubmit={(values: ICreateItemFormValues, { setSubmitting, resetForm }) => {
          setSubmitting(true)
          create({ ...values, picture: imageB64 ?? undefined })
          resetForm()
          startTransition(() => {
            setImage(null)
          })
        }}
      >
        {({ isValid, isSubmitting, dirty, resetForm, submitForm }) => (
          <Form>
            <ProceedModal
              isProceedModalOpen={isProceedModalOpen}
              setIsProceedModalOpen={setProceedItemModalOpen}
              callback={() => {
                dismissModal()
                resetForm()
              }}
              message="Are you sure you want to discard all changes?"
            ></ProceedModal>
            <Modal
              className="bg-base-100 text-base-content border-none"
              size="tiny"
              isOpen={isCreateItemModalOpen}
              onDismiss={dirty ? openProceedItemModal : dismissModal}
            >
              <ModalHeader
                title={<CreateItemModalHeader setImage={setImage} image={image}></CreateItemModalHeader>}
                onClose={dirty ? openProceedItemModal : dismissModal}
              />
              <div className="divider"></div>
              <ModalContent>
                <CreateItemModalBody></CreateItemModalBody>
              </ModalContent>
              <ModalFooter>
                <div className="px-4 py-4 text-center">
                  <button
                    type="submit"
                    className="btn btn-wide btn-primary"
                    onClick={submitForm}
                    disabled={!dirty || !isValid || isSubmitting}
                  >
                    Create
                  </button>
                </div>
              </ModalFooter>
            </Modal>
          </Form>
        )}
      </Formik>
    </>
  )
}
