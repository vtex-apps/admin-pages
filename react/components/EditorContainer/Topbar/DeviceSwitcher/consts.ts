const AVAILABLE_VIEWPORTS: Viewport[] = ['mobile', 'tablet', 'desktop']

const AVAILABLE_MOBILE_VIEWPORTS: Viewport[] = ['mobile', 'tablet']

export const VIEWPORTS_BY_DEVICE: Record<
  RenderContext['device'],
  Viewport[]
> = {
  any: AVAILABLE_VIEWPORTS,
  desktop: AVAILABLE_VIEWPORTS,
  mobile: AVAILABLE_MOBILE_VIEWPORTS,
}
