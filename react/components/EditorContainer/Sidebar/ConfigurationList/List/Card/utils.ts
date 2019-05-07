import { defineMessages, InjectedIntl } from 'react-intl'

const messages = defineMessages({
  brand: {
    defaultMessage: 'Brand: {id}',
    id: 'admin/pages.editor.configuration.tag.brand',
  },
  category: {
    defaultMessage: 'Category: {id}',
    id: 'admin/pages.editor.configuration.tag.category',
  },
  department: {
    defaultMessage: 'Department: {id}',
    id: 'admin/pages.editor.configuration.tag.department',
  },
  product: {
    defaultMessage: 'Product: {id}',
    id: 'admin/pages.editor.configuration.tag.product',
  },
  route: {
    defaultMessage: 'URL: {id}',
    id: 'admin/pages.editor.configuration.tag.route',
  },
  search: {
    defaultMessage: 'Search: {id}',
    id: 'admin/pages.editor.configuration.tag.search',
  },
  sitewide: {
    defaultMessage: 'Entire site',
    id: 'admin/pages.editor.configuration.tag.sitewide',
  },
  subcategory: {
    defaultMessage: 'Subcategory: {id}',
    id: 'admin/pages.editor.configuration.tag.subcategory',
  },
  template: {
    defaultMessage: 'This template',
    id: 'admin/pages.editor.configuration.tag.template',
  },
})

export const getTextFromContext = (
  intl: InjectedIntl,
  isSitewide: boolean,
  path: string,
  pageContext: PageContext
) => {
  if (isSitewide) {
    return intl.formatMessage(messages.sitewide)
  }

  if (pageContext.id === '*' && pageContext.type === '*') {
    return intl.formatMessage(messages.template)
  }

  return intl.formatMessage(
    {
      id: `admin/pages.editor.configuration.tag.${pageContext.type}`,
    },
    { id: pageContext.type === 'route' ? path : pageContext.id }
  )
}
