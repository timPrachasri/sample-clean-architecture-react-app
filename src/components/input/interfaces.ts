export type IGhostTextInputSize = 'default' | 'small'
export interface IGhostTextInput {
  baseBlock: string
  value: string
  callback?: (value: any) => void
}
