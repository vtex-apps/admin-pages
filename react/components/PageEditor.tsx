import PropTypes from 'prop-types'
import { filter, find, map, omit, prop, sort } from 'ramda'
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
import ObjectFieldTemplate from './form/ObjectFieldTemplate'
import Radio from './form/Radio'
import Toggle from './form/Toggle'

const defaultUiSchema = {
  'classNames': 'pages-editor-form',
}

const widgets = {
  BaseInput,
  CheckboxWidget: Toggle,
  RadioWidget: Radio,
  SelectWidget: Dropdown,
}

const partialSchema = {
  properties: {
    name: {
      title: 'Route ID',
      type: 'string',
    },
    path: {
      title: 'Path Template',
      type: 'string',
    },
    pageName: {
      title: 'Name',
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
    availableTemplates: PropTypes.arrayOf(PropTypes.object),
    component: PropTypes.string,
    declarer: PropTypes.string,
    name: PropTypes.string,
    pageName: PropTypes.string,
    path: PropTypes.string,
    routes: PropTypes.arrayOf(PropTypes.object),
    savePage: PropTypes.any,
  }

  public static contextTypes = {
    history: PropTypes.object,
  }

  public routesToOptions = map((r: Route) => ({
    label: `${r.name} (${r.path})`,
    value: r.name,
  }))

  constructor(props: any) {
    super(props)

    this.state = {
      component: props.component,
      declarer: props.declarer,
      name: props.name,
      pageName: props.pageName,
      path: props.path,
      selectedRouteId: props.name,
    }
  }

  public handleFormChange = (event) => {
    const newState = {
      ...event.formData,
    }

    if (!newState.name.startsWith('store/')) {
      newState.name = 'store'
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
    const { name: pageName, component, path } = this.state
    savePage({
      refetchQueries: [
        { query: Routes },
      ],
      variables: {
        component,
        pageName,
        path,
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
    const route = this.props.routes.find((p: Route) => p.name === value) || {
      name: value,
      pageName: 'Default',
      path: '/',
    }
    this.setState({
      context: route.context,
      name: route.name,
      pageName: route.pageName,
      path: route.path,
      selectedRouteId: route.name,
    })
  }

  public render() {
    const { routes, availableTemplates } = this.props
    const { component, context, declarer, path, name, selectedRouteId, pageName } = this.state
    const templateComponents = availableTemplates
      ? map(prop('name'), filter(template => context ? template.context === context : true, availableTemplates)
      : []

    const isStore = ({name: routeId, declarer: routeDeclarer}: Route) => routeId.startsWith('store') && !!routeDeclarer

    const storeRoutes: Route[] | null = routes && filter(isStore, routes)
    const sortedRoutes = storeRoutes && sort<Route>((a: Route, b: Route) => {
      return a.name.localeCompare(b.name)
    }, storeRoutes)

    const isDisabledRoute = !!declarer || !!(storeRoutes && find((p: Route) => p.name === name, storeRoutes))

    partialSchema.properties.name.disabled = isDisabledRoute
    partialSchema.properties.pageName.disabled = isDisabledRoute
    partialSchema.properties.path.disabled = isDisabledRoute

    const schemaProperties = selectedRouteId
      ? partialSchema.properties
      : omit(['name', 'path'], partialSchema.properties)

    const schema = {
      ...partialSchema,
      properties: {
        ...schemaProperties,
        component: {
          default: '',
          enum: templateComponents,
          enumNames: templateComponents,
          title: 'Template',
          type: 'string',
        },
      },
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
        {declarer && declarerField}
        {availableRoutes}
        <Form
          ErrorList={ErrorListTemplate}
          FieldTemplate={FieldTemplate}
          formData={{
            component,
            name,
            pageName: declarer ? 'Default' : pageName,
            path,
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
