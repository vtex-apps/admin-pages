import PropTypes from 'prop-types'
import { concat, difference, groupBy, prop, toPairs, uniq } from 'ramda'
import React, { Component, Fragment } from 'react'
import { ExtensionPoint } from 'render'

import EditBar from './components/EditBar'
import { EditorContext } from './components/EditorContext'
import EditIcon from './images/EditIcon.js'
import ShowIcon from './images/ShowIcon.js'

const nativeConditions: Condition[] = [
  {
    id: 'PAGES_SCOPE_URL',
    message: 'pages.conditions.scope.url',
    type: 'scope',
  },
  {
    id: 'PAGES_SCOPE_ROUTE',
    message: 'pages.conditions.scope.route',
    type: 'scope',
  },
  {
    id: 'PAGES_SCOPE_TEMPLATE',
    message: 'pages.conditions.scope.template',
    type: 'scope',
  },
  {
    id: 'PAGES_DEVICE_ANY',
    message: 'pages.conditions.device.any',
    type: 'device',
  },
  {
    id: 'PAGES_DEVICE_MOBILE',
    message: 'pages.conditions.device.mobile',
    type: 'device',
  },
  {
    id: 'PAGES_DEVICE_DESKTOP',
    message: 'pages.conditions.device.desktop',
    type: 'device',
  },
]

interface EditorProviderState {
  activeConditions: string[]
  conditionMode: ConditionMode
  editMode: boolean
  editTreePath: string | null
  showAdminControls: boolean
  layout: EditorLayout
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
      conditionMode: 'AND',
      editMode: false,
      editTreePath: null,
      layout: 'desktop',
      showAdminControls: true,
    }
  }

  public editExtensionPoint = (treePath: string | null) => {
    this.setState({ editTreePath: treePath })
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
    this.setState({ showAdminControls: !this.state.showAdminControls })
  }

  public getConditionsGroups = () => {
    return groupBy<Condition>(prop('type'), nativeConditions)
  }

  public getDefaultActiveConditions = () => {
    const conditionsGroups = this.getConditionsGroups()
    return toPairs(conditionsGroups)
      // get the value from the key/value pairs (i.e. the group itself)
      .map(pair => pair[1])
      // get the id of the first item of each group
      .map(group => group[0].id)
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
    const activeConditions = uniq(concat(this.state.activeConditions, [conditionId]))
    this.setState({ activeConditions })
  }

  public handleRemoveCondition = (conditionId: string) => {
    const activeConditions = difference(this.state.activeConditions, [conditionId])
    this.setState({ activeConditions })
  }

  public render() {
    const { children, runtime, runtime: { page } } = this.props
    const { editMode, editTreePath, showAdminControls, activeConditions, conditionMode, layout } = this.state
    const root = page.split('/')[0]

    const isAdmin = root === 'admin'

    if (isAdmin) {
      return children
    }

    const editor: EditorContext = {
      activeConditions,
      addCondition: this.handleAddCondition,
      conditionMode,
      conditions: nativeConditions,
      editExtensionPoint: this.editExtensionPoint,
      editMode,
      editTreePath,
      layout,
      removeCondition: this.handleRemoveCondition,
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
        <ExtensionPoint id={`${root}/__topbar`}>
          <button
            type="button"
            onClick={this.handleToggleShowAdminControls}
            className={
              'bg-blue br3 bn lh-title f6 fw5 link bn br2 mh2 pl3 pv3 pl4-l ph4-xl flex items-center justify-center z-max pointer hover-bg-heavy-blue animated fadeIn'
            }
            style={{ animationDuration: '0.2s' }}
          >
            <span className="near-white ph1"><ShowIcon /></span>
          </button>
        </ExtensionPoint>
        <EditBar editor={editor} runtime={runtime}>
          {children}
        </EditBar>
      </Fragment>
    )

    return (
      <EditorContext.Provider value={editor}>
        {adminControlsToggle}
        {showAdminControls
          ? childrenWithSidebar
          : children
        }
      </EditorContext.Provider>
    )
  }
}

export default EditorProvider
