import PropTypes from 'prop-types'
import { map, prop } from 'ramda'
import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import Form from 'react-jsonschema-form'
import { Link } from 'render'
import { Button } from 'vtex.styleguide'

import SavePage from '../queries/SavePage.graphql'
import Pages from '../queries/Pages.graphql'
import AvailableTemplates from '../queries/AvailableTemplates.graphql'

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
  title: '',
  type: 'object',
  properties: {
    path: {
      type: 'string',
      title: 'Path Template',
    },
  },
}

const createLocationDescriptor = (to, query) => ({
  pathname: to,
  state: { renderRouting: true },
  ...(query && { search: query }),
})

class PageEditor extends Component {
  static propTypes = {
    availableTemplates: PropTypes.object,
    savePage: PropTypes.any,
    name: PropTypes.string,
    path: PropTypes.string,
    component: PropTypes.string,
    editable: PropTypes.bool,
  }

  static contextTypes = {
    history: PropTypes.object,
  }

  constructor(props) {
    super(props)

    this.state = {
      page: {
        name: props.name === 'new' ? 'store/' : props.name,
        path: props.path || '/',
        component: props.component,
        editable: props.editable,
      },
    }
  }

  handleFormChange = (event) => {
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

  handleSave = (event) => {
    console.log('save', event, this.state)
    const { savePage } = this.props
    const { name: pageName, component, path } = this.state.page
    savePage({
      refetchQueries: [
        { query: Pages },
      ],
      variables: {
        pageName,
        component,
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

  render() {
    const { page } = this.state
    const templateComponents = this.props.availableTemplates.availableTemplates
      ? map(prop('name'), this.props.availableTemplates.availableTemplates)
      : []

    const schema = {
      ...partialSchema,
      properties: {
        ...partialSchema.properties,
        component: {
          enum: templateComponents,
          enumNames: templateComponents,
          title: 'Template',
          type: 'string',
          default: '',
        },
      },
    }

    if (!page.editable) {
      schema.properties.path.readonly = true
    }

    if (typeof page.login === 'string') {
      page.login = page.login === 'true'
    }

    return (
      <div className="dark-gray center">
        <Form
          FieldTemplate={FieldTemplate}
          formData={page}
          onChange={this.handleFormChange}
          onSubmit={this.handleSave}
          ObjectFieldTemplate={ObjectFieldTemplate}
          schema={schema}
          uiSchema={defaultUiSchema}
          showErrorList
          ErrorList={ErrorListTemplate}
          widgets={widgets}>
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
        renderMajor: 7,
        production: false,
      },
    }),
  })
)(PageEditor)
