import IconDesktop from './icons/IconDesktop'
import IconMobile from './icons/IconMobile'
import IconTablet from './icons/IconTablet'

const AVAILABLE_VIEWPORTS: Viewport[] = ['mobile', 'tablet', 'desktop']

const AVAILABLE_MOBILE_VIEWPORTS: Viewport[] = ['mobile', 'tablet']

export const BORDER_BY_POSITION = {
  first: 'br2 br--left b--transparent',
  last: 'br2 br--right b--transparent',
  middle: 'b--transparent',
}

export const ICON_BY_VIEWPORT = {
  desktop: IconDesktop,
  mobile: IconMobile,
  tablet: IconTablet,
}

export const VIEWPORTS_BY_DEVICE: Record<
  RenderContext['device'],
  Viewport[]
> = {
  any: AVAILABLE_VIEWPORTS,
  desktop: AVAILABLE_VIEWPORTS,
  mobile: AVAILABLE_MOBILE_VIEWPORTS,
}
