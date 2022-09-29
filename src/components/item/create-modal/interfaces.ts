import * as Yup from 'yup'

export const createItemFormValuesSchema = Yup.object({
  name: Yup.string().min(1, 'Invalid Name').max(20, 'Invalid Name').required('Required'),
  quantity: Yup.number().min(1, 'Invalid Quantity').required('Required'),
  unitName: Yup.string().min(1, 'Invalid Unit Name').max(20, 'Invalid Unit Name').required('Required'),
  unitKernelCount: Yup.number().min(0, 'Invalid kernels per unit').required('Required'),
  location: Yup.string().min(1, 'Invalid Location').max(20, 'Invalid Location').optional(),
  note: Yup.string().min(1, 'Invalid Note').max(20, 'Invalid Note').optional(),
})

export type ICreateItemFormValues = Yup.InferType<typeof createItemFormValuesSchema>
