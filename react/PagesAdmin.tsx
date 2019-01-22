import PropTypes from 'prop-types'
import { mapObjIndexed, values } from 'ramda'
import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import { canUseDOM, withRuntimeContext } from 'vtex.render-runtime'
import { PageHeader, Tab, Tabs } from 'vtex.styleguide'

import { ROUTES_LIST } from './components/admin/pages/consts'

interface CustomProps {
  params: { field: string }
  runtime: RenderContext
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

interface FieldInfo {
  path: string
  titleId: string
}

interface Fields {
  [field: string]: FieldInfo
}

const fields: Fields = {
  pages: {
    path: 'pages',
    titleId: 'pages.admin.tabs.pages',
  },
  redirects: {
    path: 'redirects',
    titleId: 'pages.admin.tabs.redirects',
  },
  settings: {
    path: 'settings',
    titleId: 'pages.admin.tabs.settings',
  },
}

class PagesAdmin extends Component<Props> {
  public static propTypes = {
    children: PropTypes.object,
    runtime: PropTypes.object,
  }

  public componentDidMount() {
    const path = this.props.params.field || ''

    if (canUseDOM) {
      if (path.length === 0) {
        this.props.runtime.navigate({ page: ROUTES_LIST })
      }
    }
  }

  public render() {
    const {
      children,
      intl,
      params,
      runtime: { navigate },
    } = this.props

    const path = params && params.field || ''

    return (
      <div className="h-100 overflow-y-auto bg-light-silver">
        {path.startsWith('storefront') ? (
          children
        ) : (
          <div className="center mw8">
            <PageHeader title="CMS" />
            <div className="ph7">
              <Tabs>
                {values(
                  mapObjIndexed((info: FieldInfo, key: string) => {
                    return (
                      <Tab
                        key={key}
                        label={intl.formatMessage({ id: info.titleId })}
                        active={
                          path.startsWith(info.path) &&
                          (path === '' ? path === info.path : true)
                        }
                        onClick={() => {
                          navigate({ to: '/admin/cms/' + info.path })
                        }}
                      />
                    )
                  }, fields),
                )}
              </Tabs>
            </div>
            {children}
          </div>
        )}
      </div>
    )
  }
}

export default withRuntimeContext(injectIntl(PagesAdmin))
