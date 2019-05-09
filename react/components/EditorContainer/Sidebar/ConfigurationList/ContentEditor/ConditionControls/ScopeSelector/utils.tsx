import { defineMessages, InjectedIntl } from 'react-intl'

// Messages used in getScopeStandardOptions
defineMessages({
  brand: {
    defaultMessage: 'this brand',
    id: 'admin/pages.editor.components.condition.scope.entity.brand',
  },
  category: {
    defaultMessage: 'this category',
    id: 'admin/pages.editor.components.condition.scope.entity.category',
  },
  department: {
    defaultMessage: 'this department',
    id: 'admin/pages.editor.components.condition.scope.entity.department',
  },
  product: {
    defaultMessage: 'this product',
    id: 'admin/pages.editor.components.condition.scope.entity.product',
  },
  route: {
    defaultMessage: 'this URL',
    id: 'admin/pages.editor.components.condition.scope.entity.route',
  },
  search: {
    defaultMessage: 'this search',
    id: 'admin/pages.editor.components.condition.scope.entity.search',
  },
  sitewide: {
    defaultMessage: 'the entire site',
    id: 'admin/pages.editor.components.condition.scope.sitewide',
  },
  subcategory: {
    defaultMessage: 'this subcategory',
    id: 'admin/pages.editor.components.condition.scope.entity.subcategory',
  },
  template: {
    defaultMessage: 'this template',
    id: 'admin/pages.editor.components.condition.scope.template',
  },
  title: {
    defaultMessage: 'Apply to',
    id: 'admin/pages.editor.components.condition.scope.title',
  },
})

export const getScopeStandardOptions = (
  intl: InjectedIntl,
  pageContext: PageContext
) => [
  {
    label: intl.formatMessage({
      id: `admin/pages.editor.components.condition.scope.entity.${
        pageContext.type
      }`,
    }),
    value: 'entity',
  },
  {
    label: intl.formatMessage({
      id: 'admin/pages.editor.components.condition.scope.template',
    }),
    value: 'template',
  },
]
