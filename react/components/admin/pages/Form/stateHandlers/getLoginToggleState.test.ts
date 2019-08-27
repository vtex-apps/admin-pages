import BASE_STATE from './__fixtures__/state'
import { getLoginToggleState } from './getLoginToggleState'

describe('getLoginToggleState', () => {
  it('should negate data.login value', () => {
    const mockState = {
      ...BASE_STATE,
      data: {
        ...BASE_STATE.data,
        auth: true,
      },
    }

    expect(getLoginToggleState(mockState)).toMatchObject({
      data: { auth: false },
    })
  })
})
