export interface IItemProps {
  id: string
  name: string
  unit: {
    name: string
    kernelCount: number
  }
  quantity: number

  // Optional Params
  location: string | null
  picture: string | null
  note: string | null
  updatedAt: Date | null
  createdAt: Date | null
}

export interface IItemUpdateParams {
  // Optional Params
  name?: string
  quantity?: number
  location?: string
  picture?: string
  note?: string
}
