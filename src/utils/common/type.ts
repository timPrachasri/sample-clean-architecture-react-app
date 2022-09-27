export const strToBool = (s: string): boolean => {
  // will match one and only one of the string 'true','1', or 'on' rerardless
  // of capitalization and regardless off surrounding white-space.
  //
  const regex = /^\s*(true|1|on)\s*$/i

  return regex.test(s)
}
