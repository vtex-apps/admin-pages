import { createKeydownFromClick } from 'keydown-from-click'
import classnames from 'classnames'
import { JSONSchema6 } from 'json-schema'
import { path } from 'ramda'
import React, { useCallback, useMemo } from 'react'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'
import { SortableElement, SortableElementProps } from 'react-sortable-hoc'

import ActionMenu from '../../../ActionMenu'
import { ActionMenuOption } from '../../../ActionMenu/typings'

import Handle from './Handle'
import NoImagePlaceholder from './NoImagePlaceholder'
import PreviewOverlay from './PreviewOverlay'

import templateStyles from '../styles.css'
import itemStyles from './ArrayFieldTemplateItem.css'

const stopPropagation = (e: Pick<React.MouseEvent, 'stopPropagation'>) => {
  e.stopPropagation()
}

interface CustomProps {
  children?: React.ReactElement<{ formData: number }> | React.ReactNode
  formIndex: number
  hasRemove: boolean
  onClose: () => void
  onOpen: (
    e: Pick<React.MouseEvent, 'stopPropagation'> | ActionMenuOption
  ) => void
  showDragHandle: boolean
  schema: JSONSchema6
}

type PropsFromItemTemplateProps = Pick<
  ArrayFieldTemplateProps['items'][0],
  'onDropIndexClick' | 'hasRemove' | 'children'
>
type Props = CustomProps &
  SortableElementProps &
  PropsFromItemTemplateProps &
  InjectedIntlProps

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

const isImageUploader = (schema: ComponentSchema) =>
  !!schema.widget && schema.widget['ui:widget'] === 'image-uploader'

const ArrayFieldTemplateItem: React.FC<Props> = props => {
  const {
    children,
    formIndex,
    hasRemove,
    intl,
    onOpen,
    onDropIndexClick,
    schema,
    showDragHandle,
  } = props

  const componentSchema = React.useMemo(() => getComponentSchema(schema), [
    schema,
  ])

  const handleItemClick = useCallback(
    (e: Pick<React.MouseEvent, 'stopPropagation'> | ActionMenuOption) => {
      onOpen(e)
    },
    [onOpen]
  )

  const handleItemKeyDown = createKeydownFromClick(handleItemClick)
  const itemStopPropagation = createKeydownFromClick(stopPropagation)

  const hasImageUploader = useMemo(
    () =>
      componentSchema &&
      componentSchema.items &&
      !Array.isArray(componentSchema.items) &&
      componentSchema.items.properties &&
      Object.values(componentSchema.items.properties).some(isImageUploader),
    [componentSchema]
  )

  const imagePreview = useMemo(() => {
    const properties =
      componentSchema &&
      componentSchema.items &&
      !Array.isArray(componentSchema.items) &&
      componentSchema.items.properties

    const imagePropertyKey =
      properties &&
      Object.keys(properties)
        .filter(property => isImageUploader(properties[property]))
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
          handleItemClick(e)
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
  }, [handleItemClick, onDropIndexClick, formIndex, hasRemove, intl])

  const title =
    children.props.formData.__editorItemTitle ||
    path(['items', 'properties', '__editorItemTitle', 'default'], schema)

  return (
    <div
      className={classnames(
        'bg-white bb b--light-silver',
        {
          [templateStyles['accordion-item--handle-hidden']]: showDragHandle,
        },
        templateStyles['accordion-item']
      )}
    >
      <div
        className={`${
          templateStyles['accordion-label']
        } bg-white flex items-center justify-center overflow-hidden relative outline-0 ${
          hasImageUploader ? 'h4' : 'h3'
        }`}
        onClick={handleItemClick}
        onKeyDown={handleItemKeyDown}
        role="treeitem"
        tabIndex={0}
      >
        {showDragHandle && <Handle />}
        <div
          className={classnames(
            'relative flex items-center',
            itemStyles['preview-container'],
            {
              [`${itemStyles['multi-item']} mr3`]: showDragHandle,
              [`${itemStyles['single-item']}`]: !showDragHandle,
              [`${itemStyles['preview-text-container']} ml3`]:
                !hasImageUploader && !showDragHandle,
            }
          )}
        >
          {hasImageUploader ? (
            <>
              {imagePreview ? (
                <img
                  alt="Preview"
                  className={`br3 bg-muted-5 h-100 w-100 ${itemStyles['preview-image']}`}
                  src={imagePreview}
                />
              ) : (
                <NoImagePlaceholder />
              )}
              <PreviewOverlay />
            </>
          ) : (
            <span className={`f6 ${templateStyles['accordion-label-title']}`}>
              {intl.formatMessage(
                title ? { id: title } : messages.defaultTitle
              )}
            </span>
          )}
          <div
            className={`absolute top-0 right-0 mr3 mt3 ${itemStyles['action-menu-container']}`}
            onClick={stopPropagation}
            onKeyDown={itemStopPropagation}
            role="button"
            tabIndex={0}
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
    </div>
  )
}

export default injectIntl(SortableElement<Props>(ArrayFieldTemplateItem))
