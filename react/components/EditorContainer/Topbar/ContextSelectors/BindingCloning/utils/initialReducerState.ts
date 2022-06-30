import { Binding } from '../../typings'

const formatBindings = (binding: Binding, currentBinding: Binding) => ({
  label: binding.canonicalBaseAddress,
  id: binding.id,
  supportedLocales: binding.supportedLocales,
  checked: false,
  overwrites: false,
  isCurrent: currentBinding.id === binding.id,
})

// Mark items as conflicting or not--that is, if saving on a
// binding will overwrite a page present there or not
export const createInitialCloningState = (
  binding: Binding,
  currentBinding: Binding,
  routeInfo: Route
) => {
  const formattedBinding = formatBindings(binding, currentBinding)

  if (formattedBinding.isCurrent) {
    return formattedBinding
  }

  // If the page has undefined binding, it is present on all bindings
  if (!routeInfo.binding) {
    return {
      ...formattedBinding,
      overwrites: true,
    }
  }

  if (!routeInfo.conflicts) {
    return formattedBinding
  }

  if (
    routeInfo.conflicts.find(
      conflict => formattedBinding.id === conflict.binding
    )
  ) {
    return {
      ...formattedBinding,
      overwrites: true,
    }
  }

  return formattedBinding
}
