import { generateNewRouteId } from './utils'

describe('#generateNewRouteId', () => {
  it('should remove trailing slash from path', () => {
    expect(
      generateNewRouteId('vtex.store@2.x:store.custom', '/path1/path2/')
    ).toBe('vtex.store@2.x:store.custom#path1-path2')
  })

  it('should generate a routeId without "/"', () => {
    expect(
      generateNewRouteId('vtex.store@2.x:store.custom', '/path1/path2')
    ).toEqual(expect.not.stringContaining('/'))
  })
})
