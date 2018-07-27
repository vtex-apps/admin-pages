import PropTypes from 'prop-types'
import React, { Component, Fragment } from 'react'
import { FormattedMessage } from 'react-intl'

import ComponentEditor from './ComponentEditor'
import ComponentList from './ComponentList'
import HighlightOverlay from './HighlightOverlay'
import PageInfo from './PageInfo'

import '../editbar.global.css'

export const APP_CONTENT_ELEMENT_ID = 'app-content'

const getContainerProps = (layout: Viewport) => {
  switch (layout) {
    case 'mobile':
      return {
        className: 'mobile-preview center',
        style: {
          animationDuration: '0.2s',
          transition: `width 660ms`,
        },
      }
    case 'tablet':
      return {
        className: 'tablet-preview center',
        style: {
          animationDuration: '0.2s',
          transition: `width 660ms`,
        },
      }
    default:
      return {
        className: 'w-100 center',
        style: {
          animationDuration: '0.2s',
          transition: `width 660ms`,
        },
      }
  }
}

interface Props {
  visible: boolean
}

interface State {
  highlightTreePath: string | null
}

export default class EditorContainer extends Component<Props & RenderContextProps & EditorContextProps, State> {
  public static propTypes = {
    children: PropTypes.node,
    editor: PropTypes.object,
    runtime: PropTypes.object,
    visible: PropTypes.bool,
  }

  constructor (props: Props & RenderContextProps & EditorContextProps) {
    super(props)

    this.state = {
      highlightTreePath: null
    }
  }

  public componentDidMount() {
    window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
  }

  public highlightExtensionPoint = (highlightTreePath: string | null) => {
    this.setState({ highlightTreePath })
  }

  public renderSideBarContent() {
    const { editor: { editTreePath }, editor, runtime } = this.props

    return editTreePath === null
      ? (
        <Fragment>
          <PageInfo editor={editor} runtime={runtime} />
          <h3 className="near-black mv0 bt bw1 b--light-silver pa5">
            <FormattedMessage id="pages.editor.components.title" />
          </h3>
          <ComponentList editor={editor} runtime={runtime} highlightExtensionPoint={this.highlightExtensionPoint} />
        </Fragment>
      )
      : <ComponentEditor editor={editor} runtime={runtime} />
  }

  public renderSideBar() {
    const { visible } = this.props

    return (
      <div
        id="sidebar-vtex"
        className="right-0-ns z-1 h-100 top-3em-ns calc--height-ns w-18em-ns fixed w-100 w-auto-ns"
        style={{
          animationDuration: '0.333s',
          transform: `translate(${visible?'0%':'+100%'}, 0)`,
          transition: `transform 300ms ease-in-out ${visible?'300ms':''}`,
        }}
        >
        <nav
          id="admin-sidebar"
          className="transition animated fadeIn b--light-silver bw1 z-2 h-100 pt8 pt0-ns calc--height-ns overflow-x-hidden fixed absolute-m w-100 font-display bg-white shadow-solid-x w-18em-ns admin-sidebar">
          <div className="h-100 overflow-y-scroll">
            {this.renderSideBarContent()}
          </div>
        </nav>
      </div>
    )
  }

  public render() {
    const { editor: { editMode, editExtensionPoint, viewport }, visible } = this.props
    return (
      <div className="w-100 flex flex-column flex-row-l flex-wrap-l bg-white bb bw1 b--light-silver">
        {this.renderSideBar()}
        <div
          id={APP_CONTENT_ELEMENT_ID}
          className={`bg-light-silver z-0 center-m left-0-m absolute-m overflow-x-auto-m ${visible?'top-3em-ns calc--height calc--height-ns calc--width-ns calc--width-m calc--width-l':'top-0 w-100'}`} style={{transition:`width 300ms ease-in-out ${visible?'300ms':''}, top 300ms ease-in-out ${!visible?'300ms':''}`}}>
          <main
            {...getContainerProps(viewport)}
            role="main">
            <HighlightOverlay editMode={editMode} editExtensionPoint={editExtensionPoint} highlightExtensionPoint={this.highlightExtensionPoint} highlightTreePath={this.state.highlightTreePath} />
            {this.props.children}
          </main>
        </div>
      </div>
    )
  }
}
