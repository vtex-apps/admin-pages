import EXTENSIONS from './__fixtures__/extensions'
import { getIsSitewide } from './utils'

describe('getIsSitewide', () => {
  it('should return true for AFTER', () => {
    const mockEditTreePath = 'store.home/$after_footer'

    expect(getIsSitewide(EXTENSIONS, mockEditTreePath)).toBe(true)
  })

  it('should return true for AROUND', () => {
    const mockEditTreePath = 'store.home/$around_homeWrapper'

    expect(getIsSitewide(EXTENSIONS, mockEditTreePath)).toBe(true)
  })

  it('should return true for BEFORE', () => {
    const mockEditTreePath = 'store.home/$before_header.full'

    expect(getIsSitewide(EXTENSIONS, mockEditTreePath)).toBe(true)
  })

  it('should return false for blocks without role', () => {
    const mockEditTreePath = 'store.home/carousel#home'

    expect(getIsSitewide(EXTENSIONS, mockEditTreePath)).toBe(false)
  })
})
