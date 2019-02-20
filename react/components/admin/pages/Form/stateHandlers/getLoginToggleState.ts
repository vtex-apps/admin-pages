import { State } from '../index'

export const getLoginToggleState = (prevState: State) => ({
  ...prevState,
  data: {
    ...prevState.data,
    auth: !!prevState.data && !prevState.data.auth,
  },
})
