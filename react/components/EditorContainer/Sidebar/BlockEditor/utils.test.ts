import { getIsDefaultContent } from './utils'

describe('getIsDefaultContent', () => {
  it('should return true when origin is declared (comes from app)', () => {
    expect(getIsDefaultContent({ origin: 'comes from block' })).toBe(true)
  })

  it('should return false when origin is null (declared by user)', () => {
    expect(getIsDefaultContent({ origin: null })).toBe(false)
  })
})
