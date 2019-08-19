import { path } from 'ramda'
import React, { Component } from 'react'
import { FormattedMessage, defineMessages } from 'react-intl'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'
import {
  SortableElement,
  SortableElementProps,
  SortableHandle,
} from 'react-sortable-hoc'
import { animated, Transition } from 'react-spring/renderprops'
import DragHandle from '../icons/DragHandle'
import TrashSimple from '../icons/TrashSimple'

const stopPropagation = (fn: (e: React.MouseEvent) => void) => (
  e: React.MouseEvent
) => {
  e.stopPropagation()
  return fn(e)
}

const Handle = SortableHandle(() => (
  <DragHandle size={12} className="accordion-handle" />
))

interface CustomProps {
  children?: React.ReactElement<{ formData: number }> | React.ReactNode
  formIndex: number
  hasRemove: boolean
  isOpen: boolean
  onClose: () => void
  onOpen: (e: React.MouseEvent) => void
  showDragHandle: boolean
  schema: object
}

interface State {
  autoHeight: boolean
}
type PropsFromItemTemplateProps = Pick<
  ArrayFieldTemplateProps['items'][0],
  'onDropIndexClick' | 'hasRemove' | 'children'
>
type Props = CustomProps & SortableElementProps & PropsFromItemTemplateProps

defineMessages({
  defaultTitle: {
    defaultMessage: 'Item',
    id: 'admin/pages.admin.pages.form.field.array.item',
  },
})

class ArrayFieldTemplateItem extends Component<Props, State> {
  public render() {
    const {
      children,
      schema,
      formIndex,
      hasRemove,
      onDropIndexClick,
      isOpen,
      showDragHandle,
    } = this.props

    const title =
      children.props.formData.__editorItemTitle ||
      path(['items', 'properties', '__editorItemTitle', 'default'], schema)

    return (
      <div
        className={`accordion-item bb b--light-silver ${
          showDragHandle ? '' : 'accordion-item--handle-hidden'
        }`}
      >
        <div className="accordion-label" onClick={this.handleLabelClick}>
          <div className="flex items-center">
            {showDragHandle && <Handle />}
            <FormattedMessage
              id={title || 'admin/pages.admin.pages.form.field.array.item'}
            >
              {message => (
                <span className="f6 accordion-label-title">{message}</span>
              )}
            </FormattedMessage>
          </div>
          <div className="flex items-center accordion-label-buttons">
            {hasRemove && (
              <button
                type="button"
                className="accordion-icon-button accordion-icon-button--remove"
                onClick={stopPropagation(onDropIndexClick(formIndex))}
              >
                <TrashSimple size={15} />
              </button>
            )}
          </div>
        </div>
        <div
          className={`accordion-content ${
            isOpen ? 'accordion-content--open' : ''
          }`}
        >
          <Transition
            native
            config={{ duration: 300 }}
            items={isOpen ? ['children'] : []}
            from={{ opacity: 0, height: 0 }}
            enter={{ opacity: 1, height: 'auto' }}
            leave={{ opacity: 0, height: 0 }}
          >
            {this.renderChildren}
          </Transition>
        </div>
      </div>
    )
  }

  private handleLabelClick = (e: React.MouseEvent) => {
    const { isOpen, onOpen, onClose } = this.props

    if (isOpen) {
      onClose()
    } else {
      onOpen(e)
    }
  }

  private renderChildren = () => (styles: React.CSSProperties) => (
    <animated.div style={styles}>{this.props.children}</animated.div>
  )
}

export default SortableElement<Props>(ArrayFieldTemplateItem)
