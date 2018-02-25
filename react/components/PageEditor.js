import Button from '@vtex/styleguide/lib/Button'
import React, {Component} from 'react'
import {graphql} from 'react-apollo'
import Form from 'react-jsonschema-form'
import PropTypes from 'prop-types'
import {Link} from 'render'

import SavePage from '../queries/SavePage.graphql'
import Pages from '../queries/Pages.graphql'

import BaseInput from './form/BaseInput'
import FieldTemplate from './form/FieldTemplate'
import ObjectFieldTemplate from './form/ObjectFieldTemplate'

const scriptComponents = Object.keys(global.__RUNTIME__.components).filter(c => !c.endsWith('.css'))

const themes = Object.keys(global.__RUNTIME__.components).filter(c => c.endsWith('theme.css'))

const widgets = {
  BaseInput,
}

const schema = {
  title: '',
  type: 'object',
  properties: {
    name: {
      type: 'string',
      title: 'Name',
    },
    path: {
      type: 'string',
      title: 'Path',
    },
    component: {
      enum: scriptComponents,
      enumNames: scriptComponents,
      title: 'Component',
      type: 'string',
    },
    theme: {
      enum: themes,
      enumNames: themes,
      type: 'string',
      title: 'Theme',
    },
    auth: {
      type: 'boolean',
      title: 'Admins only',
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
    console.log('Updating props with formData...', event.formData, this.state.page)
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
    const {name: pageName, component, path, theme, auth, cname} = this.state.page
    savePage({
      refetchQueries: [
        {query: Pages},
      ],
      variables: {
        pageName,
        component,
        path,
        theme,
        auth,
        cname,
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
    const {page} = this.state
    if (typeof page.auth === 'string') {
      page.auth = page.auth === 'true'
    }

    return (
      <div className="dark-gray center mv5">
        <Form
          schema={schema}
          formData={page}
          onChange={this.handleFormChange}
          onSubmit={this.handleSave}
          FieldTemplate={FieldTemplate}
          ObjectFieldTemplate={ObjectFieldTemplate}
          widgets={widgets}>
          <div className="mt7">
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
