import PropTypes from 'prop-types'
import { mapObjIndexed, values } from 'ramda'
import React, { Component, Fragment } from 'react'
import { PageHeader, Tab, Tabs } from 'vtex.styleguide'
import { withRuntimeContext } from 'render'

interface PagesAdminProps {
  runtime: RenderContext
}

interface PagesAdminState {
  field: string
}

interface FieldInfo {
  title: string
  path: string
}

interface Fields {
  [field: string]: FieldInfo
}

const fields: Fields = {
  pages: {
    title: 'Pages',
    path: ''
  },
  redirects: {
    title: 'Redirects',
    path: 'redirects'
  },
  settings: {
    title: 'Settings',
    path: 'settings'
  }
}

class PagesAdmin extends Component<PagesAdminProps, PagesAdminState> {
  public static propTypes = {
    runtime: PropTypes.object,
    children: PropTypes.object,
  }

  constructor(props: PagesAdminProps) {
    super(props)

    this.state = {
      field: 'pages'
    }
  }

  public render() {
    const { runtime: { navigate }, children, params } = this.props
    const { field } = this.state
    const path = params.field || ''

    return path.startsWith('editor')
      ? (
        <Fragment>
          { children }
        </Fragment>
      )
      : (
        <div>
          <PageHeader title="CMS" />
          <div className="ph7">
            <Tabs>
              {
                values(mapObjIndexed((info: FieldInfo, key: string) => {
                  return (
                    <Tab key={key} label={info.title} active={path.startsWith(info.path) && (path === '' ? path === info.path : true)} onClick={() => {
                      this.setState({ field: key })
                      navigate({ to: '/admin/pages/' + info.path })
                    }} />
                  )
                }, fields))
              }
            </Tabs>
          </div>
          { children }
        </div>
      )
  }
}

export default withRuntimeContext(PagesAdmin)
