import React from 'react'
import { SortableHandle } from 'react-sortable-hoc'

import DragHandle from '../../../icons/DragHandle'
import styles from './ArrayFieldTemplateItem.css'

const Handle = SortableHandle(() => (
  <div
    className={`flex flex-grow-1 h-100 items-center justify-center ${styles['drag-handle-container']}`}
  >
    <DragHandle size={12} className="accordion-handle" />
  </div>
))

export default Handle
