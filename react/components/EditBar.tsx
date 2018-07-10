import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'

import ComponentEditor from './ComponentEditor'
import ComponentList from './ComponentList'
import ConditionSelector from './conditions/ConditionSelector'
import PageInfo from './PageInfo'

import '../editbar.global.css'

const getContainerClasses = (layout: ConfigurationDevice) => {
  switch (layout) {
    case 'mobile':
      return 'mobile-preview center'
    default:
      return 'w-100'
  }
}

interface EditBarProps {
  visible: boolean
}

export default class EditBar extends Component<EditBarProps & RenderContextProps & EditorContextProps> {
  public static propTypes = {
    children: PropTypes.node,
    editor: PropTypes.object,
    runtime: PropTypes.object,
    visible: PropTypes.bool,
  }

  public componentDidMount() {
    window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
  }

  public renderSideBarContent() {
    const { editor: { editTreePath }, editor, runtime } = this.props
    return (
      <Fragment>
        <PageInfo editor={editor} runtime={runtime} />
        <ConditionSelector editor={editor} runtime={runtime} />
        { editTreePath == null
          ? <ComponentList editor={editor} runtime={runtime} />
          : <ComponentEditor editor={editor} runtime={runtime} />
        }
      </Fragment>
    )
  }

  public renderSideBar() {
    const { visible } = this.props

    return (
      <div
        id="sidebar-vtex"
        className="left-0 z-1 h-100-s calc--height-ns w-18em-ns fixed"
        style={{
          paddingTop: 48,
        }}
        >
        <nav
          id="admin-sidebar"
          style={{
            animationDuration: '0.333s',
            transform: `translate(${visible?'0%':'-100%'}, 0)`,
            transition: `transform 300ms ease-in-out ${visible?'300ms':''}`,
          }}
          className="transition animated fadeIn b--light-silver bw1 fixed z-2 h-100-s calc--height-ns overflow-x-hidden fixed absolute-m top-3em w-100 font-display bg-white shadow-solid-x w-18em-ns admin-sidebar">
          <div className="h-100 overflow-y-scroll">
            {this.renderSideBarContent()}
          </div>
        </nav>
      </div>
    )
  }

  public render() {
    const { editor: { device }, visible } = this.props
    return (
      <div className="w-100 flex flex-column flex-row-l flex-wrap-l pt8-s pt0-ns bg-white bb bw1 b--light-silver">
        {this.renderSideBar()}
        <div
          id="app-content"
          className={`z-0 center-m right-0-m absolute-m overflow-x-auto-m ${visible?'top-3em-ns calc--height calc--width-ns calc--width-m calc--width-l':'top-0 w-100'}`} style={{transition:`width 300ms ease-in-out ${visible?'300ms':''}, top 300ms ease-in-out ${!visible?'300ms':''}`}}>
          <main
            className={getContainerClasses(device)}
            role="main">
            {this.props.children}
          </main>
        </div>
      </div>
    )
  }
}
