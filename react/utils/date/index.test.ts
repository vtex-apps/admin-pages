import { getNextDay, getNextTime, getPreviousTime } from './index'

describe('getNextDay', () => {
  it('returns the day after a given day', () => {
    const input = new Date('2019-04-01T12:07:21.000-03:00')

    const expectedOutput = new Date('2019-04-02T00:00:00.000-03:00')

    expect(getNextDay(input)).toEqual(expectedOutput)
  })
})

describe('getNextTime', () => {
  it('works with minutes = 0', () => {
    const input = new Date('2019-04-01T12:00:00.000-03:00')

    const expectedOutput = new Date('2019-04-01T12:30:00.000-03:00')

    expect(getNextTime(input)).toEqual(expectedOutput)
  })

  it('works with 0 < minutes < 30', () => {
    const input = new Date('2019-04-01T12:23:16.000-03:00')

    const expectedOutput = new Date('2019-04-01T12:30:00.000-03:00')

    expect(getNextTime(input)).toEqual(expectedOutput)
  })

  it('works with minutes = 30', () => {
    const input = new Date('2019-04-01T15:30:00.000-03:00')

    const expectedOutput = new Date('2019-04-01T16:00:00.000-03:00')

    expect(getNextTime(input)).toEqual(expectedOutput)
  })

  it('works with 30 < minutes <= 59', () => {
    const input = new Date('2019-04-01T12:43:51.000-03:00')

    const expectedOutput = new Date('2019-04-01T13:00:00.000-03:00')

    expect(getNextTime(input)).toEqual(expectedOutput)
  })

  it('works with time > 23:30', () => {
    const input = new Date('2019-04-01T23:45:34.000-03:00')

    const expectedOutput = new Date('2019-04-02T00:00:00.000-03:00')

    expect(getNextTime(input)).toEqual(expectedOutput)
  })
})

describe('getPreviousTime', () => {
  it('works with minutes = 0', () => {
    const input = new Date('2019-04-01T12:00:00.000-03:00')

    const expectedOutput = new Date('2019-04-01T11:30:00.000-03:00')

    expect(getPreviousTime(input)).toEqual(expectedOutput)
  })

  it('works with 0 < minutes < 30', () => {
    const input = new Date('2019-04-01T12:23:16.000-03:00')

    const expectedOutput = new Date('2019-04-01T12:00:00.000-03:00')

    expect(getPreviousTime(input)).toEqual(expectedOutput)
  })

  it('works with minutes = 30', () => {
    const input = new Date('2019-04-01T15:30:00.000-03:00')

    const expectedOutput = new Date('2019-04-01T15:00:00.000-03:00')

    expect(getPreviousTime(input)).toEqual(expectedOutput)
  })

  it('works with 30 < minutes <= 59', () => {
    const input = new Date('2019-04-01T12:43:51.000-03:00')

    const expectedOutput = new Date('2019-04-01T12:30:00.000-03:00')

    expect(getPreviousTime(input)).toEqual(expectedOutput)
  })

  it('works with time = 00:00', () => {
    const input = new Date('2019-04-01T00:00:00.000-03:00')

    const expectedOutput = new Date('2019-03-31T23:30:00.000-03:00')

    expect(getPreviousTime(input)).toEqual(expectedOutput)
  })
})
