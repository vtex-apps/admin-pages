import { JSONSchema6 } from 'json-schema'
import { path } from 'ramda'
import React, { Component } from 'react'
import { defineMessages } from 'react-intl'
import { ArrayFieldTemplateProps, UiSchema } from 'react-jsonschema-form'
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
  onOpen: (e: Pick<React.MouseEvent, 'stopPropagation'>) => void
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

type SchemaTuple = [string, JSONSchema6 & { widget: UiSchema }]

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

    // TODO: fix types
    const imagePropertyKey = Object.entries(schema.items.properties)
      .reduce(
        (acc, [property, propertySchema]: any) => {
          if (
            propertySchema.widget &&
            propertySchema.widget['ui:widget'] === 'image-uploader'
          ) {
            acc.push(property)
          }
          return acc
        },
        [] as string[]
      )
      .sort((first, second) => {
        if (first.indexOf('mobile') !== -1 && second.indexOf('mobile') === -1) {
          return 1
        }

        if (first.indexOf('mobile') === -1 && second.indexOf('mobile') !== -1) {
          return -1
        }

        return 0
      })

    const imagePreview =
      imagePropertyKey.length > 0 &&
      children.props.formData[imagePropertyKey[0]]
    const title =
      children.props.formData.__editorItemTitle ||
      path(['items', 'properties', '__editorItemTitle', 'default'], schema)

    return (
      <div
        className={`accordion-item bb b--light-silver ${
          showDragHandle ? '' : 'accordion-item--handle-hidden'
        }`}
      >
        <div
          className="accordion-label outline-0"
          onClick={this.handleItemClick}
          onKeyDown={this.handleItemKeyDown}
          role="treeitem"
          tabIndex={0}
        >
          <div className="flex items-center">
            {showDragHandle && <Handle />}
            {imagePreview ? (
              <img className="br3" src={imagePreview} />
            ) : (
              <label className="f6 accordion-label-title">
                <SimpleFormattedMessage
                  id={title || 'admin/pages.admin.pages.form.field.array.item'}
                />
              </label>
            )}
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

  private handleItemClick = (e: Pick<React.MouseEvent, 'stopPropagation'>) => {
    const { isOpen, onOpen, onClose } = this.props

    if (isOpen) {
      onClose()
    } else {
      onOpen(e)
    }
  }

  private handleItemKeyDown = createKeydownFromClick(this.handleItemClick)

  private renderChildren = () => (styles: React.CSSProperties) => (
    <animated.div style={styles}>{this.props.children}</animated.div>
  )
}

export default SortableElement<Props>(ArrayFieldTemplateItem)
