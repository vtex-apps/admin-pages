import React, { Component } from 'react'

import { SidebarComponent } from '../typings'

import ComponentButton from './ComponentButton'

interface Props extends EditorContextProps {
  components: SidebarComponent[]
  highlightExtensionPoint: (treePath: string | null) => void
  onMouseEnterComponent: (event: any) => void
  onMouseLeaveComponent: () => void
}

class ComponentList extends Component<Props> {
  public render() {
    const {
      components,
      onMouseEnterComponent,
      onMouseLeaveComponent,
    } = this.props

    return (
      <div>
        <div className="bb b--light-silver" />
        {components.map(component => (
          <ComponentButton
            key={component.treePath}
            onEdit={this.handleEdit}
            onMouseEnter={onMouseEnterComponent}
            onMouseLeave={onMouseLeaveComponent}
            title={component.name}
            treePath={component.treePath}
          />
        ))}
      </div>
    )
  }

  private handleEdit = (event: any) => {
    const treePath = event.currentTarget.getAttribute('data-tree-path')

    this.props.editor.editExtensionPoint(treePath as string)
    this.props.highlightExtensionPoint(null)
  }
}

export default ComponentList
