import { InjectedIntl } from 'react-intl'

export const getScopeStandardOptions = (
  intl: InjectedIntl,
  pageContext: PageContext
) => [
  {
    label: intl.formatMessage({
      id: `pages.editor.components.condition.scope.entity.${pageContext.type}`,
    }),
    value: 'entity',
  },
  {
    label: intl.formatMessage({
      id: 'pages.editor.components.condition.scope.template',
    }),
    value: 'template',
  },
]
