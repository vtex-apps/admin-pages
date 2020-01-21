declare module 'text-encoding' {
  declare const TextEncoder = class TextEnconder {
    public encode(data: string): void
  }
}
