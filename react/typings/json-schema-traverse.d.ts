declare module 'json-schema-traverse' {
  var traverse: (
    schema: ComponentSchema,
    opts: (...args: any[]) => any | void
  ) => void
  export = traverse
}
