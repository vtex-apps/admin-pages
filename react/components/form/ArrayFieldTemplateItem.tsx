import { JSONSchema6 } from 'json-schema'
import { path } from 'ramda'
import React, { useCallback, useMemo } from 'react'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'
import { ArrayFieldTemplateProps, UiSchema } from 'react-jsonschema-form'
import {
  SortableElement,
  SortableElementProps,
  SortableHandle,
} from 'react-sortable-hoc'
import { animated, Transition } from 'react-spring/renderprops'
import ActionMenu from '../EditorContainer/Sidebar/ComponentList/SortableList/SortableListItem/ActionMenu'
import { ActionMenuOption } from '../EditorContainer/Sidebar/ComponentList/SortableList/SortableListItem/typings'
import DragHandle from '../icons/DragHandle'
import styles from './ArrayFieldTemplateItem.css'

const stopPropagation = (e: React.MouseEvent) => {
  e.stopPropagation()
}

const Handle = SortableHandle(() => (
  <div
    className={`flex flex-grow-1 h-100 items-center justify-center ${styles['drag-handle-container']}`}
  >
    <DragHandle size={12} className="accordion-handle" />
  </div>
))

interface CustomProps {
  children?: React.ReactElement<{ formData: number }> | React.ReactNode
  formIndex: number
  hasRemove: boolean
  isOpen: boolean
  onClose: () => void
  onOpen: (e: React.MouseEvent | ActionMenuOption) => void
  showDragHandle: boolean
  schema: {
    items: { properties: JSONSchema6 }
  }
}

type PropsFromItemTemplateProps = Pick<
  ArrayFieldTemplateProps['items'][0],
  'onDropIndexClick' | 'hasRemove' | 'children'
>
type Props = IProps &
  SortableElementProps &
  PropsFromItemTemplateProps &
  InjectedIntlProps

type SchemaTuple = [string, JSONSchema6 & { widget: UiSchema }]

const messages = defineMessages({
  defaultTitle: {
    defaultMessage: 'Item',
    id: 'admin/pages.admin.pages.form.field.array.item',
  },
  delete: {
    defaultMessage: 'Delete',
    id: 'admin/pages.admin.pages.form.field.array.item.delete',
  },
  edit: {
    defaultMessage: 'Edit',
    id: 'admin/pages.admin.pages.form.field.array.item.edit',
  },
})

const ArrayFieldTemplateItem: React.FC<Props> = props => {
  const {
    children,
    formIndex,
    hasRemove,
    intl,
    isOpen,
    onDropIndexClick,
    schema,
    showDragHandle,
  } = props

  const TransitionChildren = useMemo(
    () => (_: string) => (style: React.CSSProperties) => (
      <animated.div style={style}>{props.children}</animated.div>
    ),
    [props.children]
  )

  const handleLabelClick = useCallback(
    (e: React.MouseEvent | ActionMenuOption) => {
      if (props.isOpen) {
        props.onClose()
      } else {
        props.onOpen(e)
      }
    },
    [props.isOpen, props.onOpen, props.onClose]
  )

  const imagePreview = useMemo(() => {
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

    return imagePropertyKey && children.props.formData[imagePropertyKey]
  }, [schema.items.properties, children.props.formData])

  const actionMenuOptions: ActionMenuOption[] = useMemo(() => {
    const options: ActionMenuOption[] = [
      {
        label: intl.formatMessage(messages.edit),
        onClick: e => {
          handleLabelClick(e)
        },
      },
    ]

    if (hasRemove) {
      options.push({
        label: intl.formatMessage(messages.delete),
        onClick: () => {
          const e = new Event('click')
          onDropIndexClick(formIndex)(e)
        },
      })
    }

    return options
  }, [handleLabelClick, onDropIndexClick])

  const title =
    children.props.formData.__editorItemTitle ||
    path(['items', 'properties', '__editorItemTitle', 'default'], schema)

  return (
    <div
      className={`accordion-item bg-white bb b--light-silver ${
        showDragHandle ? '' : 'accordion-item--handle-hidden'
      }`}
    >
      <div
        className={`accordion-label flex items-center overflow-hidden relative ${
          imagePreview ? 'h4' : 'h3'
        }`}
        onClick={handleLabelClick}
      >
        {showDragHandle && <Handle />}
        <div className={`relative mr3 ${styles['preview-container']}`}>
          {imagePreview ? (
            <>
              <div
                className={`br3 absolute w-100 h-100 ${styles['preview-overlay']}`}
              ></div>
              <img
                className={`br3 h-100 w-100 ${styles['preview-image']}`}
                src={imagePreview}
              />
            </>
          ) : (
            <label className="ml7 f6 accordion-label-title">
              {intl.formatMessage(
                title ? { id: title } : messages.defaultTitle
              )}
            </label>
          )}
          <div
            className={`absolute top-0 right-0 ${styles['action-menu-container']}`}
            onClick={stopPropagation}
          >
            <ActionMenu
              variation="primary"
              menuWidth={200}
              options={actionMenuOptions}
              buttonSize="small"
            />
          </div>
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

export default injectIntl(SortableElement<Props>(ArrayFieldTemplateItem))
