import { InjectedIntl } from 'react-intl'

export const getScopeSitewideOption = (intl: InjectedIntl) => ({
  label: intl.formatMessage({
    id: 'pages.editor.components.condition.scope.sitewide',
  }),
  value: 'sitewide',
})

export const getScopeStandardOptions = (
  intl: InjectedIntl,
  pageContext: PageContext
) => [
  {
    label: intl.formatMessage({
      id: `pages.editor.components.condition.scope.specific.${pageContext.type}`,
    }),
    value: 'specific',
  },
  {
    label: intl.formatMessage({
      id: 'pages.editor.components.condition.scope.generic',
    }),
    value: 'generic',
  },
]
