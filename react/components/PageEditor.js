import Button from '@vtex/styleguide/lib/Button'
import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import Form from 'react-jsonschema-form'
import PropTypes from 'prop-types'
import {Link} from 'render'

import {getImplementation} from '../utils/components'
import {ObjectFieldTemplate, CustomFieldTemplate} from '../utils/formExtensions'

import SavePage from '../queries/SavePage.graphql'

const schema = {
  title: 'Pagina',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Nome',
    },
    auth: {
      type: 'boolean',
      title: 'Admin only',
    },
    path: {
      type: 'string',
      title: 'Caminho',
    },
    cname: {
      type: 'string',
      title: 'CNAME',
    },
    theme: {
      type: 'string',
      title: 'Tema',
    },
  },
}

const createLocationDescriptor = (to, query) => ({
  pathname: to,
  state: {renderRouting: true},
  ...(query && {search: query}),
})

class PageEditor extends Component {
  static propTypes = {
    page: PropTypes.any,
    savePage: PropTypes.any,
  }

  static contextTypes = {
    history: PropTypes.object,
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      page: props.page || {},
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      page: nextProps.page || {},
    })
  }

  handleFormChange = (event) => {
    console.log('Updating props with formData...', event.formData)
    this.setState({
      page: {
        ...this.state.page,
        ...event.formData,
      },
    })
  }

  handleSave = (event) => {
    console.log('save', event, this.state)
    const {savePage} = this.props
    savePage({
      variables: {
        pageName: this.state.page.name,
        component: this.state.page.component,
        path: this.state.page.path,
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
      this.handleCancel()
    })
  }

  getEditableComponents = () => {
    return Object.keys(global.__RUNTIME__.components).filter(component => {
      const Component = getImplementation(component)
      return Component && Component.schema
    })
  }

  render() {
    const {page} = this.state

    return (
      <div className="mw6 ph5 dark-gray center mv5">
        <Form
          schema={schema}
          formData={page}
          onChange={this.handleFormChange}
          onSubmit={this.handleSave}
          FieldTemplate={CustomFieldTemplate}
          ObjectFieldTemplate={ObjectFieldTemplate}>
          <div className="mt5">
            <Button htmlProps={{type: 'submit', className: 'fw5 ph5 pv3 ttu br2 fw4 f7 bw1 ba b--blue bg-blue white hover-bg-heavy-blue hover-b--heavy-blue pointer mr5'}} primary>
              Salvar
            </Button>
            <Link to="/admin/pages">
              <Button>
                Cancelar
              </Button>
            </Link>
          </div>
        </Form>
      </div>
    )
  }
}

export default graphql(SavePage, {name: 'savePage'})(PageEditor)
