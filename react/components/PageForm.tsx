import PropTypes from 'prop-types'
import { filter, map, omit, prop, sort } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { FormattedMessage } from 'react-intl'
import Form from 'react-jsonschema-form'
import { Link, withRuntimeContext } from 'render'
import { Button, Dropdown as StyleguideDropdown } from 'vtex.styleguide'

import Routes from '../queries/Routes.graphql'
import SavePage from '../queries/SavePage.graphql'
import BaseInput from './form/BaseInput'
import Dropdown from './form/Dropdown'
import ErrorListTemplate from './form/ErrorListTemplate'
import FieldTemplate from './form/FieldTemplate'
import MultiSelect from './form/MultiSelect'
import ObjectFieldTemplate from './form/ObjectFieldTemplate'
import Radio from './form/Radio'
import Toggle from './form/Toggle'

const defaultUiSchema = {
  classNames: 'pages-editor-form',
  conditions: {
    'ui:widget': 'multi-select',
  },
}

const widgets: any = {
  BaseInput,
  CheckboxWidget: Toggle,
  RadioWidget: Radio,
  SelectWidget: Dropdown,
  ['multi-select']: MultiSelect,
}

const availableDevices = ['', 'mobile', 'desktop']

const availableDevicesNames = [
  'All devices',
  'Mobile devices',
  'Desktop devices',
]

const availableContexts = [
  '',
  'vtex.store@1.x/StoreContextProvider',
  'vtex.store@1.x/ProductContextProvider',
  'vtex.store@1.x/ProductSearchContextProvider',
]

const availableContextsNames = [
  'No context',
  'Store context',
  'Product context',
  'Product search context',
]

// tslint:disable:object-literal-sort-keys
const partialSchema = {
  required: ['routeId', 'path', 'name'],
  properties: {
    routeId: {
      title: 'Route ID',
      type: 'string',
    },
    context: {
      enum: availableContexts,
      enumNames: availableContextsNames,
      title: 'Context',
      type: 'string',
    },
    path: {
      title: 'Path Template',
      type: 'string',
    },
    name: {
      title: 'Name',
      type: 'string',
    },
    device: {
      default: '',
      enum: availableDevices,
      enumNames: availableDevicesNames,
      title: 'Device',
      type: 'string',
    },
    login: {
      default: false,
      title: 'Required Login?',
      type: 'boolean',
    },
  },
  title: '',
  type: 'object',
}
// tslint:enable:object-literal-sort-keys

const CUSTOM_ROUTE = [
  {
    label: 'Create new route...',
    value: 'store/',
  },
]

class PageForm extends Component<any, any> {
  public static propTypes = {
    availableConditions: PropTypes.arrayOf(PropTypes.string).isRequired,
    configurationId: PropTypes.string,
    routeId: PropTypes.string,
    routes: PropTypes.arrayOf(PropTypes.object),
    savePage: PropTypes.func,
    templates: PropTypes.arrayOf(PropTypes.object),
  }

  public static contextTypes = {
    history: PropTypes.object,
  }

  public routesToOptions = map((r: Route) => ({
    label: `${r.id} (${r.path})`,
    value: r.id,
  }))

  constructor(props: any) {
    super(props)

    let page: any
    const route = props.routes.find((r: any) => {
      const foundPage = r.pages.find(
        (p: any) => p.configurationId === props.configurationId,
      )

      if (foundPage) {
        page = foundPage

        return true
      }
    })

    this.state = {
      allMatches: page && page.allMatches,
      availableConditions: props.availableConditions,
      conditions: page && page.conditions,
      configurationId: props.configurationId,
      context: route && route.context,
      isLoading: false,
      login: route && !!route.login,
      name: page && page.name,
      pageDeclarer: page && page.declarer,
      path: route && route.path,
      routeDeclarer: route && route.declarer,
      routeId: route && route.id,
      selectedRouteId: route && route.id,
      template: page && page.template,
    }
  }

  public handleFormChange = (event: any) => {
    const newState = {
      ...event.formData,
    }

    if (!newState.routeId.startsWith('store/')) {
      newState.id = 'store'
    }

    if (!newState.path.startsWith('/')) {
      newState.path = '/'
    }

    this.setState(newState)
  }

  public handleRouteChange = (e: any, value: any) => {
    const route = this.props.routes.find((p: Route) => p.id === value) || {
      id: value,
      path: '/',
    }
    this.setState({
      conditions: [],
      context: route.context,
      login: !!route.login,
      name: '',
      path: route.path,
      routeDeclarer: route.declarer,
      routeId: route.id,
      selectedRouteId: route.id,
    })
  }

  public render() {
    const { routes, templates } = this.props
    const {
      allMatches,
      availableConditions,
      category,
      conditions,
      context,
      department,
      isLoading,
      login,
      name,
      pageDeclarer,
      path,
      routeDeclarer,
      routeId,
      selectedRouteId,
      slug,
      subcategory,
      template,
    } = this.state

    const templateIds = templates
      ? templates
          .filter((currTemplate: { context: string }) =>
            context ? currTemplate.context === context : true
          )
          .map(prop('id'))
      : []

    const isStore = ({ id }: Route) => id.startsWith('store')

    const storeRoutes: Route[] | null = routes && filter(isStore, routes)
    const sortedRoutes =
      storeRoutes &&
      sort<Route>((a: Route, b: Route) => {
        return a.id.localeCompare(b.id)
      }, storeRoutes)

    const isEditablePage = !pageDeclarer

    const omittedProperties = selectedRouteId
      ? isEditablePage
        ? ['context']
        : ['conditions', 'allMatches', 'context']
      : [
          'routeId',
          'path',
          'name',
          'device',
          'conditions',
          'allMatches',
          'template',
          'context',
        ]

    // tslint:disable:object-literal-sort-keys
    const dynamicSchema: any = {
      ...partialSchema.properties,
      template: {
        default: template,
        enum: templateIds,
        enumNames: templateIds,
        title: 'Template',
        type: 'string',
      },
      conditions: {
        items: {
          enum: availableConditions,
          enumNames: availableConditions,
          type: 'string',
        },
        title: 'Conditions',
        type: 'array',
        uniqueItems: true,
      },
      allMatches: {
        title: 'Must match all conditions',
        type: 'boolean',
      },
    }
    // tslint:enable:object-literal-sort-keys

    dynamicSchema.routeId.disabled = !isEditablePage
    dynamicSchema.path.disabled = !isEditablePage
    dynamicSchema.context.disabled = !isEditablePage
    dynamicSchema.name.disabled = !isEditablePage
    dynamicSchema.device.disabled = !isEditablePage

    const properties = omit(omittedProperties, dynamicSchema)

    const schema: any = {
      ...partialSchema,
      properties,
      required: partialSchema.required.concat(['template']),
    }

    if (context === 'vtex.store@1.x/ProductContextProvider' && !routeDeclarer) {
      schema.properties.slug = {
        title: 'Product Slug',
        type: 'string',
      }
    }

    if (
      context === 'vtex.store@1.x/ProductSearchContextProvider' &&
      !routeDeclarer
    ) {
      schema.properties.department = {
        title: 'Department',
        type: 'string',
      }

      schema.properties.category = {
        title: 'Category',
        type: 'string',
      }

      schema.properties.subcategory = {
        title: 'Subcategory',
        type: 'string',
      }
    }

    const availableRoutes = sortedRoutes && (
      <StyleguideDropdown
        disabled={!!routeDeclarer}
        label="Route type"
        placeholder="Select a route"
        options={this.routesToOptions(sortedRoutes).concat(CUSTOM_ROUTE)}
        value={selectedRouteId}
        onChange={this.handleRouteChange}
      />
    )

    const routeDeclarerField = (
      <div className="form-group field field-string w-100">
        <label className="vtex-input w-100">
          <span className="vtex-input__label db mb3 w-100">Declarer</span>
          <div className="flex vtex-input-prefix__group relative">
            <input
              className="w-100 ma0 border-box bw1 br2 b--solid outline-0 near-black b--light-gray bg-light-gray bg-light-silver b--light-silver silver f6 pv3 ph5"
              disabled
              type="text"
              value={routeDeclarer}
            />
          </div>
        </label>
      </div>
    )

    return (
      <div className="dark-gray center">
        <div id="form__error-list-template___alert" />
        <h1>{this.props.name === null ? 'Create Page' : 'Edit Page'}</h1>
        {routeDeclarer && routeDeclarerField}
        {availableRoutes}
        <Form
          ErrorList={ErrorListTemplate}
          FieldTemplate={FieldTemplate}
          formData={{
            allMatches,
            category,
            conditions,
            context,
            department,
            login,
            name,
            path,
            routeId,
            slug,
            subcategory,
            template,
          }}
          ObjectFieldTemplate={ObjectFieldTemplate}
          onChange={this.handleFormChange}
          onSubmit={this.handleSave}
          schema={schema}
          showErrorList
          uiSchema={defaultUiSchema}
          widgets={widgets}
        >
          <div className="mt7">
            <Link to="/admin/cms/pages">
              <Button disabled={isLoading} size="small" variation="tertiary">
                <FormattedMessage id="pages.admin.pages.form.button.cancel" />
              </Button>
            </Link>
            <Button
              disabled={isLoading}
              isLoading={isLoading}
              size="small"
              type="submit"
              variation="primary"
            >
              <FormattedMessage id="pages.admin.pages.form.button.save" />
            </Button>
          </div>
        </Form>
      </div>
    )
  }

  private handleSave = () => {
    const {
      runtime: { navigate },
      savePage,
    } = this.props

    const {
      allMatches,
      conditions,
      configurationId,
      context,
      device,
      login,
      name,
      path,
      routeId,
      template,
    } = this.state

    this.setState({ isLoading: true }, async () => {
      try {
        await savePage({
          refetchQueries: [{ query: Routes }],
          variables: {
            allMatches,
            conditions,
            configurationId,
            context,
            device,
            login,
            name,
            path,
            routeId,
            template,
          },
        })

        navigate({ page: 'admin/cms/pages', params: {} })
      } catch (err) {
        this.setState({ isLoading: false }, () => {
          console.log(err)

          alert('Error: page could not be saved.')
        })
      }
    })
  }
}

export default compose(
  graphql(SavePage, {
    name: 'savePage',
    options: { fetchPolicy: 'cache-and-network' },
  }),
  withRuntimeContext,
)(PageForm)
