import React, { Component } from 'react'
import { SortableElement, SortableElementProps } from 'react-sortable-hoc'

import { NormalizedComponent } from '../../typings'

import DragHandle from './DragHandle'
import ExpandArrow from './ExpandArrow'
import Item from './Item'

interface Props extends SortableElementProps {
  component: NormalizedComponent
  editor: EditorContext
  onDelete: (treePath: string) => void
  onEdit: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseEnter: (
    event: React.MouseEvent<HTMLDivElement | HTMLLIElement>
  ) => void
  onMouseLeave: () => void
  shouldRenderOptions: boolean
}

interface State {
  isExpanded: boolean
}

class SortableListItem extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isExpanded: false,
    }
  }

  public render() {
    const {
      component,
      editor,
      onDelete,
      onEdit,
      onMouseEnter,
      onMouseLeave,
      shouldRenderOptions,
    } = this.props

    const subitems = component.components

    return (
      <li className="list">
        <div
          className="flex items-center bb bt bg-white hover-bg-light-silver b--light-silver"
          data-tree-path={component.treePath}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {shouldRenderOptions && component.isSortable && (
            <DragHandle onMouseEnter={this.handleMouseEnter} />
          )}
          <Item
            hasLeftPadding={
              editor.mode === 'content' ||
              (shouldRenderOptions && !component.isSortable)
            }
            onEdit={onEdit}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            title={component.name}
            treePath={component.treePath}
          />
          {subitems && (
            <ExpandArrow
              isExpanded={this.state.isExpanded}
              onClick={this.toggleExpansion}
            />
          )}
          {shouldRenderOptions && component.isSortable && (
            <div onClick={this.handleDelete}>delete</div>
          )}
        </div>
        {this.state.isExpanded && subitems && (
          <ul className="mv0 pl0">
            {subitems.map((item, index) => (
              <li
                className="flex bg-white hover-bg-light-silver list"
                data-tree-path={item.treePath}
                key={item.treePath}
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
              >
                <div className="bl bw2 b--light-blue" />
                <div
                  className={`w-100 ${
                    index !== subitems.length - 1 ? 'bb b--light-silver ' : ''
                  }`}
                >
                  <Item
                    isChild
                    onEdit={onEdit}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    title={item.name}
                    treePath={item.treePath}
                  />
                </div>
              </li>
            ))}
            <div className="bb b--light-silver" />
          </ul>
        )}
      </li>
    )
  }

  private handleDelete = () => {
    const { component, onDelete } = this.props

    onDelete(component.treePath)
  }

  private handleMouseEnter = () => {
    if (this.props.component.isSortable) {
      if (this.state.isExpanded) {
        this.setState({
          isExpanded: false,
        })
      }
    }
  }

  private toggleExpansion = () => {
    this.setState(prevState => ({
      ...prevState,
      isExpanded: !prevState.isExpanded,
    }))
  }
}

export default SortableElement(SortableListItem)
