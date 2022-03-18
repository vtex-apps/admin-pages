import { JSONSchema6 } from 'json-schema'
import React, { Fragment } from 'react'
import { ArrayFieldTemplateProps } from 'react-jsonschema-form'
import { SortableContainer, SortableContainerProps } from 'react-sortable-hoc'

import { ActionMenuOption } from '../../ActionMenu/typings'

import ArrayFieldTemplateItem from './ArrayFieldTemplateItem'

import styles from './styles.css'
import { ItemEditStyles } from './ItemForm'
import ArrayItemWrapper from './ArrayItemWrapper'

interface ArrayListProps {
  formContext: { currentDepth: number }
  items: ArrayFieldTemplateProps['items']
  onClose: () => void
  onOpen: (
    index: number
  ) => (e: Pick<React.MouseEvent, 'stopPropagation'> | ActionMenuOption) => void
  openItem: number | null
  schema: JSONSchema6
  sorting?: boolean
  stackDepth: number
  itemEditStyle?: ItemEditStyles
  itemTitleKey?: string
}

const ArrayList: React.FC<ArrayListProps & SortableContainerProps> = ({
  children,
  formContext,
  items,
  schema,
  openItem,
  onOpen,
  onClose,
  sorting,
  stackDepth,
  itemEditStyle,
  itemTitleKey,
}) => (
    <div className={sorting ? styles['accordion-list-container--sorting'] : ''}>
      {children}
      {items.map(element => (
        <Fragment key={element.index}>
          <ArrayFieldTemplateItem
            schema={schema}
            onOpen={onOpen(element.index)}
            onClose={onClose}
            formIndex={element.index}
            showDragHandle={items.length > 1}
            itemTitleKey={itemTitleKey}
            {...element}
          />
          <ArrayItemWrapper 
            element={element}
            openItem={openItem}
            currentDepth={formContext.currentDepth}
            stackDepth={stackDepth}
            onClose={onClose}
            itemEditStyle={itemEditStyle}
          />
        </Fragment>
      ))}
    </div>
  )

export default SortableContainer(ArrayList)
