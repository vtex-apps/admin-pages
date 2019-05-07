import { defineMessages, InjectedIntl } from 'react-intl'

export const getTextFromContext = (
  intl: InjectedIntl,
  isSitewide: boolean,
  path: string,
  pageContext: PageContext
) => {
  if (isSitewide) {
    return intl.formatMessage({
      id: 'admin/pages.editor.configuration.tag.sitewide',
    })
  }

  if (pageContext.id === '*' && pageContext.type === '*') {
    return intl.formatMessage({
      id: 'admin/pages.editor.configuration.tag.template',
    })
  }

  return intl.formatMessage(
    {
      id: `admin/pages.editor.configuration.tag.${pageContext.type}`,
    },
    { id: pageContext.type === 'route' ? path : pageContext.id }
  )
}
