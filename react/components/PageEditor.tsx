import PropTypes from 'prop-types'
import { filter, map, omit, prop, sort } from 'ramda'
import React, { Component } from 'react'
import { graphql } from 'react-apollo'
import Form from 'react-jsonschema-form'
import { Link } from 'render'
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
  'classNames': 'pages-editor-form',
  conditions: {
    'ui:widget': 'multi-select',
  },
}

const widgets = {
  BaseInput,
  CheckboxWidget: Toggle,
  RadioWidget: Radio,
  SelectWidget: Dropdown,
  ['multi-select']: MultiSelect,
}

const availableDevices = [
  '',
  'mobile',
  'desktop',
]

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
  },
  title: '',
  type: 'object',
}

const CUSTOM_ROUTE = [{
  label: 'Create new route...',
  value: 'store/',
}]

const createLocationDescriptor = (to, query) => ({
  pathname: to,
  state: { renderRouting: true },
  ...(query && { search: query }),
})

class PageEditor extends Component<any, any> {
  public static propTypes = {
    availableConditions: PropTypes.arrayOf(PropTypes.string).isRequired,
    name: PropTypes.string,
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

    const route = props.routeId && props.routes.find((r => r.id === props.routeId))
    const page = route && route.pages.find(p => p.name === props.name)
    const params = page && page.paramsJSON && JSON.parse(page.paramsJSON)

    this.state = {
      ...params,
      // TODO (pages-graphql dep) - Replace with anyMatch: page && page.anyMatch
      anyMatch: false,
      availableConditions: props.availableConditions,
      conditions: page && page.conditions,
      context: route && route.context,
      declarer: route && route.declarer,
      name: props.name,
      path: route && route.path,
      routeId: props.routeId,
      selectedRouteId: props.routeId,
      template: page && page.template,
    }
  }

  public handleFormChange = (event) => {
    const newState = {
      ...event.formData,
    }

    if (!newState.routeId.startsWith('store/')) {
      newState.id = 'store'
    }

    if (!newState.path.startsWith('/')) {
      newState.path = '/'
    }

    console.log('Updating props with formData...', event.formData, newState)
    this.setState(newState)
  }

  public handleSave = (event) => {
    console.log('save', event, this.state)
    const { savePage } = this.props
    const {
      anyMatch,
      category,
      conditions,
      context,
      department,
      device,
      name,
      path,
      routeId,
      slug,
      subcategory,
      template,
    } = this.state

    let paramsJSON

    if (slug) {
      paramsJSON = JSON.stringify({slug})
    } else if (department || category || subcategory) {
      paramsJSON = JSON.stringify({department, category, subcategory})
    }

    savePage({
      refetchQueries: [
        { query: Routes },
      ],
      variables: {
          anyMatch,
          conditions,
        context,
        device,
        name,
        paramsJSON,
        path,
        routeId,
        template,
      },
    })
    .then((data) => {
      console.log('OK!', data)
      const location = createLocationDescriptor('/admin/pages')
      this.context.history.push(location)
    })
    .catch(err => {
      alert('Error saving page configuration.')
      console.log(err)
    })
  }

  public handleRouteChange = (e, value) => {
    const route = this.props.routes.find((p: Route) => p.id === value) || {
      id: value,
      path: '/',
    }
    this.setState({
      anyMatch: false,
      conditions: [],
      context: route.context,
      declarer: route.declarer,
      name: '',
      path: route.path,
      routeId: route.id,
      selectedRouteId: route.id,
    })
  }

  public render() {
    const { routes, templates } = this.props
    const {
      anyMatch,
      availableConditions,
      category,
      conditions,
      context,
      declarer,
      department,
      name,
      path,
      routeId,
      selectedRouteId,
      slug,
      subcategory,
      template,
    } = this.state

    const templateIds = templates
      ? map(prop('id'), filter(template => context ? template.context === context : true, templates))
      : []

    const isStore = ({id, declarer: routeDeclarer}: Route) => id.startsWith('store')

    const storeRoutes: Route[] | null = routes && filter(isStore, routes)
    const sortedRoutes = storeRoutes && sort<Route>((a: Route, b: Route) => {
      return a.id.localeCompare(b.id)
    }, storeRoutes)

    const isEditableRoute = !declarer

    partialSchema.properties.routeId.disabled = !isEditableRoute
    partialSchema.properties.path.disabled = !isEditableRoute
    partialSchema.properties.context.disabled = !isEditableRoute

    const omittedProperties = selectedRouteId ? ['context'] : ['routeId', 'path', 'context']
    const schemaProperties = omit(omittedProperties, partialSchema.properties)

    const schema = {
      ...partialSchema,
      required: partialSchema.required.concat(['template']),
      properties: {
        ...schemaProperties,
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
          uniqueItems: true
        },
        anyMatch: {
          title: 'Must match all conditions',
          type: 'boolean',
        },
      },
    }

    if (context === 'vtex.store@1.x/ProductContextProvider' && !declarer) {
      schema.properties.slug = {
        title: 'Product Slug',
        type: 'string',
      }
    }

    if (context === 'vtex.store@1.x/ProductSearchContextProvider' && !declarer) {
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
        label="Route type"
        placeholder="Select a route"
        options={this.routesToOptions(sortedRoutes).concat(CUSTOM_ROUTE)}
        value={selectedRouteId}
        onChange={this.handleRouteChange}
      />
    )

    const declarerField = (
      <div className="form-group field field-string w-100">
        <label className="vtex-input w-100">
          <span className="vtex-input__label db mb3 w-100">Declarer</span>
          <div className="flex vtex-input-prefix__group relative">
            <input className="w-100 ma0 border-box bw1 br2 b--solid outline-0 near-black b--light-gray bg-light-gray bg-light-silver b--light-silver silver f6 pv3 ph5"
              disabled
              type="text"
              value={declarer} />
          </div>
        </label>
      </div>
    )

    return (
      <div className="dark-gray center">
        <div id="form__error-list-template___alert" />
        <h1>{this.props.name === null ? 'Create Page' : 'Edit Page'}</h1>
        {declarer && declarerField}
        {availableRoutes}
        <Form
          ErrorList={ErrorListTemplate}
          FieldTemplate={FieldTemplate}
          formData={{
            anyMatch,
            category,
            conditions,
            context,
            department,
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
            <Link to="/admin/pages">
              <Button size="small" variation="tertiary">
                Cancel
              </Button>
            </Link>
            <Button
              size="small"
              type="submit"
              className="fw5 ph5 pv3 ttu br2 fw4 f7 bw1 ba b--blue bg-blue white hover-bg-heavy-blue hover-b--heavy-blue pointer mr5"
              variation="primary">
              Save
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default graphql(SavePage, { name: 'savePage', options: { fetchPolicy: 'cache-and-network' } })(PageEditor)
