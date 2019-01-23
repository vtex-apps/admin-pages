import React, { Component, Fragment } from 'react'
import { SortableElement, SortableElementProps } from 'react-sortable-hoc'

import { NormalizedComponent } from '../../typings'

import Button from './Button'
import DragHandle from './DragHandle'
import ExpandArrow from './ExpandArrow'

interface Props extends SortableElementProps {
  component: NormalizedComponent
  onEdit: (event: React.MouseEvent<HTMLButtonElement>) => void
  onMouseEnter: (event: React.MouseEvent<HTMLButtonElement>) => void
  onMouseLeave: () => void
  shouldRenderDragHandle: boolean
}

interface State {
  isExpanded: boolean
}

class SortableButton extends Component<Props, State> {
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
        <div className="flex items-center bb bw1 b--light-silver">
          {shouldRenderDragHandle && component.isSortable && (
            <DragHandle onMouseEnter={this.handleMouseEnter} />
          )}
          <Button
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
          <Fragment>
            {subitems.map((item, index) => (
              <div className="flex" key={item.treePath}>
                <div className="bl bw2 b--light-blue" />
                <div
                  className={`w-100 ${
                    index !== subitems.length - 1 ? 'bb b--light-silver ' : ''
                  }`}
                >
                  <Button
                    isChild
                    onEdit={onEdit}
                    onMouseEnter={onMouseEnter}
                    onMouseLeave={onMouseLeave}
                    title={item.name}
                    treePath={item.treePath}
                  />
                </div>
              </div>
            ))}
            <div className="bb bw1 b--light-silver" />
          </Fragment>
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

export default SortableElement(SortableButton)
