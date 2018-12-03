import React from 'react'
import { SortableHandle } from 'react-sortable-hoc'

import SideButton from './SideButton'

const DragHandle = SortableHandle(() => <SideButton>::</SideButton>)

export default DragHandle
