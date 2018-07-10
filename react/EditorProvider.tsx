import PropTypes from 'prop-types'
import { difference, groupBy, prop, toPairs, uniq } from 'ramda'
import React, { Component, Fragment } from 'react'
import { ExtensionPoint } from 'render'

import EditBar from './components/EditBar'
import { EditorContext } from './components/EditorContext'
import EditIcon from './images/EditIcon.js'
import ShowIcon from './images/ShowIcon.js'

const nativeConditions: Condition[] = [
  {
    id: 'CONDITIONS_DIA_DOS_NAMORADOS',
    message: 'Dia dos Namorados',
    multiple: true,
    type: 'custom',
  },
  {
    id: 'CONDITIONS_DIA_DOS_NAMORADOS',
    message: 'Dia dos Pais',
    multiple: true,
    type: 'custom',
  },
]

interface EditorProviderState {
  activeConditions: string[]
  anyMatch: boolean
  editMode: boolean
  editTreePath: string | null
  highlightTreePath: string | null
  showAdminControls: boolean
  scope: ConfigurationScope
  device: ConfigurationDevice
}

class EditorProvider extends Component<{} & RenderContextProps, EditorProviderState> {
  public static contextTypes = {
    components: PropTypes.object,
  }

  public static propTypes = {
    children: PropTypes.element.isRequired,
    runtime: PropTypes.object,
  }

  constructor(props: any) {
    super(props)

    this.state = {
      activeConditions: this.getDefaultActiveConditions(),
      anyMatch: false,
      device: 'desktop',
      editMode: false,
      editTreePath: null,
      highlightTreePath: null,
      scope: 'url',
      showAdminControls: true,
    }
  }

  public componentDidMount() {
    const { runtime: { page } } = this.props
    const root = page.split('/')[0]
    if (root !== 'admin') {
      Array.prototype.forEach.call(
        document.getElementsByClassName('render-container'),
        (e: any) => e.classList.add('editor-provider'),
      )
    }
    window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
  }

  public editExtensionPoint = (treePath: string | null) => {
    this.setState({ editTreePath: treePath, highlightTreePath: null })
  }

  public mouseOverExtensionPoint = (treePath: string | null) => {
    this.setState({ highlightTreePath: treePath })
  }

  public handleToggleEditMode = () => {
    this.setState(
      {
        editMode: !this.state.editMode,
      },
      () => {
        window.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
      }
    )
  }

  public handleToggleShowAdminControls = () => {
    const showAdminControls = !this.state.showAdminControls

    Array.prototype.forEach.call(
      document.getElementsByClassName('render-container'),
      (e: any) => showAdminControls ? e.classList.add('editor-provider') : e.classList.remove('editor-provider'),
    )

    this.setState({ showAdminControls })
  }

  public getConditionsGroups = () => {
    return groupBy<Condition>(prop('type'), nativeConditions)
  }

  public getDefaultActiveConditions = () => {
    const conditionsGroups = this.getConditionsGroups()
    return toPairs(conditionsGroups)
      // get the value from the key/value pairs (i.e. the group itself)
      .map(pair => pair[1])
      // get the first item of each group
      .map(group => group[0])
      // excludes multiples
      .filter(item => !item.multiple)
      // returns the id of the first item of each remaining group
      .map(item => item.id)
  }

  public findConditionsGroup = (conditionId: string) => {
    const conditionsGroups = this.getConditionsGroups()
    const group = toPairs(conditionsGroups)
      .find(pair =>
        pair[1].some(condition => condition.id === conditionId)
      )

    return group && group[1]
  }

  public handleAddCondition = (conditionId: string) => {
    const currentGroup = this.findConditionsGroup(conditionId)
    const isMultiple = currentGroup ? currentGroup[0].multiple : false

    let activeConditions

    if(!isMultiple){
      const externalConditions = difference(
        this.state.activeConditions,
        currentGroup ? currentGroup.map(condition=>condition.id) : []
      )
      activeConditions = externalConditions.concat(conditionId)
    }else{
      activeConditions = this.state.activeConditions.concat(conditionId)
    }

    this.setState({ activeConditions: uniq(activeConditions) })
  }

  public handleRemoveCondition = (conditionId: string) => {
    const currentGroup = this.findConditionsGroup(conditionId)
    const isMultiple = currentGroup ? currentGroup[0].multiple : false

    if(!isMultiple){
      return
    }

    const activeConditions = difference(this.state.activeConditions, [conditionId])
    this.setState({ activeConditions })
  }

  public handleSetScope = (scope: ConfigurationScope) => {
    this.setState({scope})
  }

  public handleSetDevice = (device: ConfigurationDevice) => {
    this.setState({device})
  }

  public render() {
    const { children, runtime, runtime: { page } } = this.props
    const { editMode, editTreePath, highlightTreePath, showAdminControls, activeConditions, anyMatch, device, scope } = this.state
    const root = page.split('/')[0]

    const isAdmin = root === 'admin'

    if (isAdmin) {
      return children
    }

    const editor: EditorContext = {
      activeConditions,
      addCondition: this.handleAddCondition,
      anyMatch,
      conditions: nativeConditions,
      device,
      editExtensionPoint: this.editExtensionPoint,
      editMode,
      editTreePath,
      highlightTreePath,
      mouseOverExtensionPoint: this.mouseOverExtensionPoint,
      removeCondition: this.handleRemoveCondition,
      scope,
      setDevice: this.handleSetDevice,
      setScope: this.handleSetScope,
      toggleEditMode: this.handleToggleEditMode,
    }

    const adminControlsToggle = showAdminControls ? null : (
      <button
        type="button"
        onClick={this.handleToggleShowAdminControls}
        className={
          'bg-blue br-100 bn shadow-1 flex items-center justify-center z-max fixed top-1 top-2-ns left-1 left-2-ns pointer grow hover-bg-heavy-blue animated fadeIn'
        }
        style={{ height: '56px', width: '56px', animationDuration: '0.2s' }}
      >
        <EditIcon />
      </button>
    )

    const childrenWithSidebar = (
      <Fragment>
        <div
          className="fixed left-0 right-0 z-9999 h-3em"
          style={{
            animationDuration: '0.2s',
            transform: `translate(0,${showAdminControls?0:'-100%'})`,
            transition: `transform 300ms ease-in-out ${!showAdminControls?'300ms':''}`,
          }}
        >
          <ExtensionPoint id={`${root}/__topbar`}>
            <button
              type="button"
              onClick={this.handleToggleShowAdminControls}
              className={
                'bg-blue br3 bn lh-title f6 fw5 link bn br2 mh2 pl3 pv3 pl4-l ph4-xl flex items-center justify-center z-max pointer hover-bg-heavy-blue animated fadeIn'
              }
            >
              <span className="near-white ph1"><ShowIcon /></span>
            </button>
          </ExtensionPoint>
        </div>
        <EditBar editor={editor} runtime={runtime} visible={showAdminControls}>
          {children}
        </EditBar>
      </Fragment>
    )

    return (
      <EditorContext.Provider value={editor}>
        {adminControlsToggle}
        {childrenWithSidebar}
      </EditorContext.Provider>
    )
  }
}

export default EditorProvider
