import React, { Component } from 'react'
import { injectIntl } from 'react-intl'
import { SortableElement, SortableElementProps } from 'react-sortable-hoc'

import { NormalizedComponent } from '../../typings'

import ActionMenu from './ActionMenu'
import DragHandle from './DragHandle'
import ExpandArrow from './ExpandArrow'
import Item from './Item'
import { ActionMenuOption } from './typings'

interface CustomProps extends SortableElementProps {
  component: NormalizedComponent
  onDelete: (treePath: string) => void
  onEdit: (event: React.MouseEvent<HTMLDivElement>) => void
  onMouseEnter: (
    event: React.MouseEvent<HTMLDivElement | HTMLLIElement>
  ) => void
  onMouseLeave: () => void
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

interface State {
  isExpanded: boolean
}

class SortableListItem extends Component<Props, State> {
  private actionMenuOptions: ActionMenuOption[]

  constructor(props: Props) {
    super(props)

    this.actionMenuOptions = [
      {
        label: props.intl.formatMessage({
          id: 'pages.editor.component-list.action-menu.delete',
        }),
        onClick: this.handleDelete,
      },
    ]

    this.state = {
      isExpanded: false,
    }
  }

  public render() {
    const { component, onEdit, onMouseEnter, onMouseLeave } = this.props

    const subitems = component.components

    return (
      <li className="list">
        <div
          className="flex items-center bb bg-white hover-bg-light-silver b--light-silver"
          data-tree-path={component.treePath}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {component.isSortable && (
            <DragHandle
              onMouseEnter={this.handleMouseEnter}
              isExpandable={!!subitems}
            />
          )}
          {subitems && (
            <ExpandArrow
              hasLeftMargin={!component.isSortable}
              isExpanded={this.state.isExpanded}
              onClick={this.toggleExpansion}
            />
          )}
          <Item
            hasSubItems={!!subitems}
            isSortable={component.isSortable}
            onEdit={onEdit}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            title={component.name}
            treePath={component.treePath}
          />
          {component.isSortable && (
            <ActionMenu options={this.actionMenuOptions} />
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

export default injectIntl(SortableElement(SortableListItem))
