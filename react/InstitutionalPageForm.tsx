import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import { Box, ToastConsumer } from 'vtex.styleguide'

import { RouteFormData } from 'pages'

import Form from './components/admin/institutional/Form'
import withContentContext, {
  ContentContextProps,
} from './components/admin/institutional/Form/withContentContext'
import { parseStoreAppId } from './components/admin/institutional/utils'

import {
  INSTITUTIONAL_ROUTES_LIST,
  NEW_ROUTE_ID,
} from './components/admin/pages/consts'
import Title from './components/admin/pages/Form/Title'
import { formatToFormData } from './components/admin/pages/Form/utils'
import { getRouteTitle } from './components/admin/pages/utils'
import {
  TargetPathContextProps,
  withTargetPath,
} from './components/admin/TargetPathContext'
import { TargetPathRenderProps } from './PagesAdminWrapper'

import withStoreSettings, {
  FormProps,
} from './components/EditorContainer/StoreEditor/Store/StoreForm/components/withStoreSettings'

interface CustomProps {
  params: {
    id: string
  }
  runtime: RenderContext
}

type Props = CustomProps &
  RenderContextProps &
  TargetPathRenderProps &
  TargetPathContextProps &
  FormProps &
  ContentContextProps

interface State {
  formData: RouteFormData
  routeId: string
}

class PageForm extends Component<Props, State> {
  private isNew: boolean

  constructor(props: Props) {
    super(props)

    const { params, route } = props
    const routeId = decodeURIComponent(params.id)

    this.isNew = routeId === NEW_ROUTE_ID
    this.state = {
      formData: route ? formatToFormData(route) : this.defaultFormData(),
      routeId,
    }
  }

  public render() {
    const {
      store,
      runtime,
      content,
      saveRoute,
      deleteRoute,
      saveContent,
    } = this.props
    const { formData } = this.state

    return (
      <div className="h-100 min-vh-100 overflow-y-auto bg-light-silver">
        <div className="center mw8 mv8">
          <Box>
            <div className="pa4">
              {this.isNew ? (
                <FormattedMessage id="admin/pages.admin.pages.form.title.new">
                  {text => <Title>{text}</Title>}
                </FormattedMessage>
              ) : (
                formData && <Title>{getRouteTitle(formData)}</Title>
              )}
              <ToastConsumer>
                {({ showToast, hideToast }) => (
                  <Form
                    store={store}
                    initialData={formData}
                    initialContent={content}
                    culture={runtime.culture}
                    onDelete={deleteRoute}
                    onExit={this.exit}
                    onSave={saveRoute}
                    onSaveContent={saveContent}
                    showToast={showToast}
                    hideToast={hideToast}
                  />
                )}
              </ToastConsumer>
            </div>
          </Box>
        </div>
      </div>
    )
  }

  private exit = () => {
    this.props.runtime.navigate({ page: INSTITUTIONAL_ROUTES_LIST, params: {} })
  }

  private defaultFormData = (): RouteFormData => {
    const { blockId, store, interfaceId } = this.props
    const storeAppId = parseStoreAppId(store)

    return {
      auth: false,
      blockId,
      context: `${storeAppId}/ContentPageContext`,
      declarer: null,
      domain: 'store',
      interfaceId,
      metaTagDescription: '',
      metaTagKeywords: [],
      pages: [],
      path: '',
      routeId: '',
      title: '',
      uuid: undefined,
    }
  }
}

export default withRuntimeContext(
  withTargetPath(
    withStoreSettings(
      withContentContext(PageForm, ({ params, runtime, store }: Props) => ({
        culture: runtime.culture,
        routeId: decodeURIComponent(params.id),
        storeAppId: parseStoreAppId(store),
      }))
    )
  )
)
