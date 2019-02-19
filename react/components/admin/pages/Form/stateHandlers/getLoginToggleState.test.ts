import { State } from '../index'
import { getLoginToggleState } from './getLoginToggleState'

describe('getLoginToggleState', () => {
  it('should negate data.login value', () => {
    const mockState = {
      data: {
        auth: true,
      },
    } as State

    expect(getLoginToggleState(mockState)).toEqual(
      expect.objectContaining({ data: { auth: false } })
    )
  })
})
