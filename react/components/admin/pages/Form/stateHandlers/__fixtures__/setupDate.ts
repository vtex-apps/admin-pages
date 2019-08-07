import MockDate from 'mockdate'

const setupDate = () => {
  beforeEach(() => {
    MockDate.set('2019-02-01')
  })

  afterEach(() => {
    MockDate.reset()
  })
}

export default setupDate
