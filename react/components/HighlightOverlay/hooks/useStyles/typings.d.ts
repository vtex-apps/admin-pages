import { CSSProperties } from 'react'

import { ObserverReturnType } from '../useResizeObserver'
import { State } from '../../typings'

interface GetStylesParams {
  hasValidElement?: boolean
  highlightTreePath: State['highlightTreePath']
  visibleElement?: Element
}

export type GetStyles = (
  params: GetStylesParams
) => {
  highlightStyle: CSSProperties
  labelStyle: CSSProperties
  maskStyle: CSSProperties
}

interface UseStylesParams extends GetStylesParams, ObserverReturnType {
  isOverlayMaskActive: boolean
  setState: React.Dispatch<React.SetStateAction<State>>
}

export type UseStyles = (params: UseStylesParams) => void
