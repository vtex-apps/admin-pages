import PropTypes from 'prop-types'
import { mapObjIndexed, values } from 'ramda'
import React, { Component, Fragment } from 'react'
import { withRuntimeContext } from 'render'
import { PageHeader, Tab, Tabs } from 'vtex.styleguide'

interface Props {
  params: { field: string }
  runtime: RenderContext
}

interface FieldInfo {
  path: string
  title: string
}

interface Fields {
  [field: string]: FieldInfo
}

const fields: Fields = {
  pages: {
    path: 'pages',
    title: 'Pages',
  },
  redirects: {
    path: 'redirects',
    title: 'Redirects',
  },
  settings: {
    path: 'settings',
    title: 'Settings',
  },
}

class PagesAdmin extends Component<Props> {
  public static propTypes = {
    children: PropTypes.object,
    runtime: PropTypes.object,
  }

  public render() {
    const {
      children,
      params,
      runtime: { navigate },
    } = this.props
    const path = params.field || ''

    if (path.length === 0) {
      navigate({ to: '/admin/cms/pages' })
    }

    return path.startsWith('storefront') ? (
      <Fragment>{children}</Fragment>
    ) : (
      <div>
        <PageHeader title="CMS" />
        <div className="ph7">
          <Tabs>
            {values(
              mapObjIndexed((info: FieldInfo, key: string) => {
                return (
                  <Tab
                    key={key}
                    label={info.title}
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
    )
  }
}

export default withRuntimeContext(PagesAdmin)
