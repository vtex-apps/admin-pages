declare module 'json-schema-traverse' {
  const traverse: (
    schema: ComponentSchema,
    opts: (
      schema: JSONSchema6 & { widget: Widget },
      JSONPointer: string
    ) => void
  ) => void

  export default traverse
}
