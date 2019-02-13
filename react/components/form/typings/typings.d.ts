export interface Option {
  label: string
  value: any
}

export interface State<T> {
  data: T
  errors: any
  loading: boolean
  value: any
}

export interface NativeType {
  id: string
  name: string
}
