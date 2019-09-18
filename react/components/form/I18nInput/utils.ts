export const isValidData = (
  data: unknown
): data is {
  target: HTMLInputElement | HTMLTextAreaElement
  value: string
} =>
  typeof data === 'object' &&
  data !== null &&
  Object.prototype.hasOwnProperty.call(data, 'target') &&
  Object.prototype.hasOwnProperty.call(data, 'value')
