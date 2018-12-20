import React, { Component, Fragment } from 'react'
import { SortableElement, SortableElementProps } from 'react-sortable-hoc'

import { NormalizedComponent } from '../../typings'

import DragHandle from './DragHandle'
import ExpandArrow from './ExpandArrow'
import ListItem from './ListItem'

interface Props extends SortableElementProps {
  component: NormalizedComponent
  onEdit: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseEnter: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseLeave: () => void
  shouldRenderDragHandle: boolean
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
      onEdit,
      onMouseEnter,
      onMouseLeave,
      shouldRenderDragHandle,
    } = this.props

    const subitems = component.components

    return (
      <li className="list">
        <div className="flex items-center bb bt bg-white hover-bg-light-silver b--light-silver">
          {shouldRenderDragHandle && component.isSortable && (
            <DragHandle onMouseEnter={this.handleMouseEnter} />
          )}
          <ListItem
            hasLeftPadding={shouldRenderDragHandle && !component.isSortable}
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
        </div>
        {this.state.isExpanded && subitems && (
          <ul className="mv0 pl0">
            {subitems.map((item, index) => (
              <li
                className="flex bg-white hover-bg-light-silver list"
                key={item.treePath}
              >
                <div className="bl bw2 b--light-blue" />
                <div
                  className={`w-100 ${
                    index !== subitems.length - 1 ? 'bb b--light-silver ' : ''
                    }`}
                >
                  <ListItem
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
