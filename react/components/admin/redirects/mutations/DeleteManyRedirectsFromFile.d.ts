export interface DeleteManyRedirectsFromFileVariables {
  paths: string[]
}

export type DeleteManyRedirectsFromFileResult = boolean

export type DeleteManyRedirectsFromFileFn = MutationFn<
  DeleteManyRedirectsFromFileVariables,
  DeleteManyRedirectsFromFileResult
>

export interface DeleteManyRedirectsProps {
  deleteManyRedirects: DeleteManyRedirectsFromFileFn
}
