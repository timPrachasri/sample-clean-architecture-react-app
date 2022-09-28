export const formatInteger = (amount: string | number | undefined): string => {
  const zero = 0
  if (Number.isNaN(amount) || amount === '' || amount === undefined) {
    return zero.toFixed(0)
  }
  const num = parseFloat(String(amount))
  return num.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
}
