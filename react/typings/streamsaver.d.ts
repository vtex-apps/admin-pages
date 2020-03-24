declare module 'streamsaver' {
  interface Constructable<T> {
    new (): T
  }

  interface StreamSaver {
    static WritableStream: Constructable<WritableStream>
    createWriteStream: (name: string) => WritableStream
  }

  let WritableStream: WritableStream
  const streamsaver: StreamSaver

  export default streamsaver
}
