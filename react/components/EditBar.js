import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { RenderContextConsumer } from 'render'

import EditIcon from '../images/EditIcon.js'
import CloseIcon from '../images/CloseIcon.js'

import ComponentEditor from '../components/ComponentEditor'

import ConditionSelector from '../ConditionSelector'

import '../editbar.global.css'

const getContainerClasses = layout => {
  switch (layout) {
    case 'full':
      return 'w-100'
    case 'mobile':
      return 'mw4 center'
  }
}

export default class EditBar extends Component {
  static propTypes = {
    editTreePath: PropTypes.string,
    editMode: PropTypes.bool,
    onToggleEditMode: PropTypes.func,
    page: PropTypes.string,
    children: PropTypes.node,
  }

  constructor(props) {
    super(props)

    this.state = {
      layout: 'full',
    }
  }

  componentDidMount() {
    Array.prototype.forEach.call(
      document.getElementsByClassName('render-container'),
      e => e.classList.add('edit-mode'),
    )
  }

  componentWillUnmount() {
    Array.prototype.forEach.call(
      document.getElementsByClassName('render-container'),
      e => e.classList.remove('edit-mode'),
    )
  }

  renderSideBarContent() {
    const { editTreePath, editMode } = this.props

    const editToggle = (
      <button
        type="button"
        onClick={this.props.onToggleEditMode}
        className={
          'bg-blue br3 pa4 bn shadow-1 flex mv4 items-center justify-center pointer hover-bg-heavy-blue animated fadeIn'
        }
        style={{ animationDuration: '0.2s' }}
      >
        {editMode ? <CloseIcon /> : <EditIcon />}
        <span className="white pl4">
          {editMode ? 'Stop editing' : 'Start editing'}
        </span>
      </button>
    )

    return (<RenderContextConsumer>
      {runtime => {
        const extension = runtime.extensions[editTreePath]
        const { component, props = {} } = extension || {}
        const componentEditor = extension && <ComponentEditor component={component} props={props} treePath={editTreePath} />

        return (
          <Fragment>
            <ConditionSelector />
            { editTreePath == null
              ? editToggle
              : componentEditor
            }
          </Fragment>
        )
      }}
    </RenderContextConsumer>
    )
  }

  renderSideBar() {
    return (
      <div
        id="sidebar-vtex"
        className="left-0 z-1 h-100-s calc--height-ns w-18em-ns fixed">
        <nav
          id="admin-sidebar"
          style={{ animationDuration: '0.333s' }}
          className="transition animated fadeIn b--light-silver bw1 pa4 fixed z-2 h-100-s calc--height-ns overflow-x-hidden fixed absolute-m top-3em w-100 font-display bg-white shadow-solid-x w-18em-ns admin-sidebar">
          {this.renderSideBarContent()}
        </nav>
      </div>
    )
  }

  render() {
    const { layout } = this.state
    return (
      <div className="w-100 flex flex-column flex-row-l flex-wrap-l pt8-s pt0-ns bg-white bb bw1 b--light-silver">
        {this.renderSideBar()}
        <div
          id="app-content"
          className="calc--height z-0 top-3em-ns center-m right-0-m absolute-m overflow-x-auto-m calc--width-ns calc--width-m calc--width-l">
          <main
            className={getContainerClasses(layout)}
            role="main">
            {this.props.children}
          </main>
        </div>
      </div>
    )
  }
}
