import classnames from 'classnames'
import { JSONSchema6 } from 'json-schema'
import { path } from 'ramda'
import React, { useCallback, useMemo } from 'react'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'
import { SortableElement, SortableElementProps } from 'react-sortable-hoc'
import ActionMenu from '../../EditorContainer/Sidebar/ComponentList/SortableList/SortableListItem/ActionMenu'
import { ActionMenuOption } from '../../EditorContainer/Sidebar/ComponentList/SortableList/SortableListItem/typings'
import styles from './ArrayFieldTemplateItem.css'

import Handle from './Handle'
import NoImagePlaceholder from './NoImagePlaceholder'
import PreviewOverlay from './PreviewOverlay'

const stopPropagation = (e: React.MouseEvent) => {
  e.stopPropagation()
}

interface IProps {
  children?: React.ReactElement<{ formData: number }> | React.ReactNode
  formIndex: number
  hasRemove: boolean
  isOpen: boolean
  onClose: () => void
  onOpen: (e: React.MouseEvent | ActionMenuOption) => void
  showDragHandle: boolean
  schema: JSONSchema6
}

type PropsFromItemTemplateProps = Pick<
  ArrayFieldTemplateProps['items'][0],
  'onDropIndexClick' | 'hasRemove' | 'children'
>
type Props = IProps &
  SortableElementProps &
  PropsFromItemTemplateProps &
  InjectedIntlProps

type SchemaTuple = [string, ComponentSchema]

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

function getComponentSchema(schema: JSONSchema6): ComponentSchema | null {
  if (
    schema.items &&
    !Array.isArray(schema.items) &&
    typeof schema.items === 'object' &&
    typeof schema.items.properties === 'object'
  ) {
    return schema as ComponentSchema
  }
  return null
}

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

  const componentSchema = React.useMemo(() => getComponentSchema(schema), [
    schema,
  ])

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

  const hasImageUploader = useMemo(() => {
    return (
      componentSchema &&
      componentSchema.items &&
      componentSchema.items.properties &&
      Object.values(componentSchema.items.properties).some(
        (propertySchema: ComponentSchema) => {
          return (
            propertySchema.widget &&
            propertySchema.widget['ui:widget'] === 'image-uploader'
          )
        }
      )
    )
  }, [componentSchema])

  const imagePreview = useMemo(() => {
    const imagePropertyKey =
      componentSchema &&
      componentSchema.items &&
      componentSchema.items.properties &&
      Object.entries(componentSchema.items.properties)
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
          if (
            first.indexOf('mobile') !== -1 &&
            second.indexOf('mobile') === -1
          ) {
            return 1
          }

          if (
            first.indexOf('mobile') === -1 &&
            second.indexOf('mobile') !== -1
          ) {
            return -1
          }

          return 0
        })
        .find(key => {
          return !!children.props.formData[key]
        })

    return imagePropertyKey && children.props.formData[imagePropertyKey]
  }, [componentSchema, children.props.formData])

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
      className={classnames('accordion-item bg-white bb b--light-silver', {
        'absolute left-0 top-0 ph6 w-100 h-100 z-1': isOpen,
        'accordion-item--handle-hidden': showDragHandle,
      })}
    >
      {isOpen ? (
        props.children
      ) : (
        <div
          className={`accordion-label bg-white flex items-center justify-center overflow-hidden relative ${
            hasImageUploader ? 'h4' : 'h3'
          }`}
          onClick={handleLabelClick}
        >
          {showDragHandle && <Handle />}
          <div
            className={classnames(
              'relative flex items-center',
              styles['preview-container'],
              {
                mr3: showDragHandle,
                [`${styles['preview-text-container']} ml3`]:
                  !hasImageUploader && !showDragHandle,
              }
            )}
          >
            {hasImageUploader ? (
              <>
                {imagePreview ? (
                  <img
                    className={`br3 bg-muted-5 h-100 w-100 ${styles['preview-image']}`}
                    src={imagePreview}
                  />
                ) : (
                  <NoImagePlaceholder />
                )}
                <PreviewOverlay />
              </>
            ) : (
              <label className="f6 accordion-label-title">
                {intl.formatMessage(
                  title ? { id: title } : messages.defaultTitle
                )}
              </label>
            )}
            <div
              className={`absolute top-0 right-0 mr3 mt3 ${styles['action-menu-container']}`}
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
      )}
    </div>
  )
}

export default injectIntl(SortableElement<Props>(ArrayFieldTemplateItem))
