import React from 'react'

import { useEditorContext } from '../../../EditorContext'

import { VIEWPORTS_BY_DEVICE } from './consts'
import DeviceItem from './DeviceItem'

interface Props {
  device: RenderContext['device']
}

const DeviceSwitcher: React.FC<Props> = ({ device }) => {
  const editor = useEditorContext()

  const handleClick = React.useCallback(
    ({ currentTarget }: Pick<React.MouseEvent, 'currentTarget'>) => {
      if (currentTarget && currentTarget instanceof HTMLElement) {
        editor.setViewport(currentTarget.dataset.type as Viewport)
      }
    },
    [editor]
  )

  const viewports = VIEWPORTS_BY_DEVICE[device === 'any' ? 'desktop' : device]

  return (
    <div className="flex">
      {viewports.map((deviceType, index) => {
        const isLast = index === viewports.length - 1

        return (
          <>
            <DeviceItem
              isActive={deviceType === editor.viewport}
              key={deviceType}
              onClick={handleClick}
              position={index === 0 ? 'first' : isLast ? 'last' : 'middle'}
              type={deviceType}
            />

            {!isLast && <div className="br c-muted-5" />}
          </>
        )
      })}
    </div>
  )
}

export default DeviceSwitcher
