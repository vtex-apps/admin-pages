import PropTypes from 'prop-types'
import { map, prop } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import Form from 'react-jsonschema-form'
import { Link } from 'render'
import { Button } from 'vtex.styleguide'

import AvailableTemplates from '../queries/AvailableTemplates.graphql'
import Pages from '../queries/Pages.graphql'
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
  },
  title: '',
  type: 'object',
}

const createLocationDescriptor = (to, query) => ({
  pathname: to,
  state: { renderRouting: true },
  ...(query && { search: query }),
})

class PageEditor extends Component {
  public static propTypes = {
    availableTemplates: PropTypes.object,
    component: PropTypes.string,
    name: PropTypes.string,
    path: PropTypes.string,
    savePage: PropTypes.any,
  }

  public static contextTypes = {
    history: PropTypes.object,
  }

  public static getDerivedStateFromProps = (props: any) => ({
    page: {
      component: props.component,
      declarer: props.declarer,
      name: props.name === 'new' ? 'store/' : props.name,
      path: props.path || '/',
    },
  })

  constructor(props: any) {
    super(props)

    this.state = {
      page: {
        component: props.component,
        declarer: props.declarer,
        name: props.name === 'new' ? 'store/' : props.name,
        path: props.path || '/',
      },
    }
  }

  public handleFormChange = (event) => {
    const newState = {
      page: {
        ...this.state.page,
        ...event.formData,
      },
    }

    if (!newState.page.name.startsWith('store/')) {
      newState.page.name = 'store/'
    }

    if (!newState.page.path.startsWith('/')) {
      newState.page.path = '/'
    }

    console.log('Updating props with formData...', event.formData, newState)
    this.setState(newState)
  }

  public handleSave = (event) => {
    console.log('save', event, this.state)
    const { savePage } = this.props
    const { name: pageName, component, path } = this.state.page
    savePage({
      refetchQueries: [
        { query: Pages },
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

  public render() {
    const { page } = this.state
    const templateComponents = this.props.availableTemplates.availableTemplates
      ? map(prop('name'), this.props.availableTemplates.availableTemplates)
      : []

    const schema = {
      ...partialSchema,
      properties: {
        ...partialSchema.properties,
        component: {
          default: '',
          enum: templateComponents,
          enumNames: templateComponents,
          title: 'Template',
          type: 'string',
        },
      },
    }

    schema.properties.name.disabled = !!page.declarer
    schema.properties.path.disabled = !!page.declarer

    if (typeof page.login === 'string') {
      page.login = page.login === 'true'
    }

    const declarer = (
      <div className="form-group field field-string w-100">
        <label className="vtex-input w-100">
          <span className="vtex-input__label db mb3 w-100">Declarer</span>
          <div className="flex vtex-input-prefix__group relative">
            <input className="w-100 ma0 border-box bw1 br2 b--solid outline-0 near-black b--light-gray bg-light-gray bg-light-silver b--light-silver silver f6 pv3 ph5" disabled type="text" value={page.declarer} />
          </div>
        </label>
      </div>
    )

    return (
      <div className="dark-gray center">
        {page.declarer && declarer}
        <Form
          ErrorList={ErrorListTemplate}
          FieldTemplate={FieldTemplate}
          formData={page}
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

export default compose(
  graphql(SavePage, { name: 'savePage', options: { fetchPolicy: 'cache-and-network' } }),
  graphql(AvailableTemplates, {
    name: 'availableTemplates',
    options: (props) => ({
      variables: {
        pageName: props.name,
        production: false,
        renderMajor: 7,
      },
    }),
  })
)(PageEditor)
