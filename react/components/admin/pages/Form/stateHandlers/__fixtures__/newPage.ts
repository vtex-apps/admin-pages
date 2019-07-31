import { ConditionsOperator } from 'vtex.styleguide'

const newPage = {
  condition: {
    allMatches: true,
    id: '',
    statements: [
      {
        error: '',
        object: {
          date: new Date('2019-02-01'),
        },
        subject: 'date',
        verb: 'is',
      },
    ],
  },
  operator: 'all' as ConditionsOperator,
  pageId: '',
  template: '',
}

export default newPage
