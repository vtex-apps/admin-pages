import { JSONSchema6, JSONSchema6Definition } from 'json-schema'
import { path } from 'ramda'
import React, { useCallback, useMemo } from 'react'
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
  schema: {
    items: { properties: JSONSchema6 }
  }
}

type PropsFromItemTemplateProps = Pick<
  ArrayFieldTemplateProps['items'][0],
  'onDropIndexClick' | 'hasRemove' | 'children'
>
type Props = CustomProps & SortableElementProps & PropsFromItemTemplateProps

type SchemaTuple = [string, JSONSchema6 & { widget: UiSchema }]

const messages = defineMessages({
  defaultTitle: {
    defaultMessage: 'Item',
    id: 'admin/pages.admin.pages.form.field.array.item',
  },
})

const ArrayFieldTemplateItem: React.FC<Props> = props => {
  const {
    children,
    schema,
    formIndex,
    hasRemove,
    onDropIndexClick,
    isOpen,
    showDragHandle,
  } = props

  const TransitionChildren = useMemo(
    () => (_: string) => (styles: React.CSSProperties) => (
      <animated.div style={styles}>{props.children}</animated.div>
    ),
    [props.children]
  )

  const handleLabelClick = useCallback(
    (e: React.MouseEvent) => {
      if (props.isOpen) {
        props.onClose()
      } else {
        props.onOpen(e)
      }
    },
    [props.isOpen, props.onOpen, props.onClose]
  )

  const imagePropertyKey = Object.entries(schema.items.properties!)
    .reduce(
      (acc, [property, propertySchema]: SchemaTuple) => {
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
    .find(key => {
      return !!children.props.formData[key]
    })

  const imagePreview =
    imagePropertyKey && children.props.formData[imagePropertyKey]

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
        className={`accordion-label ${imagePreview ? 'h4' : 'h3'}`}
        onClick={handleLabelClick}
      >
        <div className="flex items-center overflow-hidden">
          {showDragHandle && <Handle />}
          {imagePreview ? (
            <img
              className="br3 ml7"
              style={{ maxWidth: 'calc(100% - 3rem)' }}
              src={imagePreview}
            />
          ) : (
            <label className="ml7 f6 accordion-label-title">
              <SimpleFormattedMessage id={title || messages.defaultTitle.id} />
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
          {TransitionChildren}
        </Transition>
      </div>
    </div>
  )
}

export default SortableElement<Props>(ArrayFieldTemplateItem)
