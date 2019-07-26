import * as React from 'react'

import { Media } from 'draft-js'

const Media = (props: Media) => {
  const { contentState, block } = props
  const blockEntity = block.getEntityAt(0)

  if (!blockEntity) {
    return null
  }

  const entity = contentState.getEntity(blockEntity)
  const { src } = entity.getData()
  const type = entity.getType()

  if (type === 'IMAGE') {
    return <img src={src} />
  }

  return null
}

export default Media
