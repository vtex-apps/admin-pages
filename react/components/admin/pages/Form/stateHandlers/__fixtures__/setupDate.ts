export default function setupDate() {
  const RealDate = Date

  function mockDate(isoDate: string) {
    global.Date = class extends RealDate {
      public constructor(...args: number[]) {
        super()

        if (args.length > 0) {
          return new RealDate(
            args[0],
            args[1],
            args[2],
            args[3],
            args[4],
            args[5],
            args[6]
          )
        }
        return new RealDate(isoDate)
      }
    }
  }

  beforeAll(() => {
    mockDate('2019-02-01')
  })

  afterAll(() => {
    global.Date = RealDate
  })
}
