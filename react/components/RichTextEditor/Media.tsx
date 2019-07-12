import * as React from 'react'

const Image = ({ src }: { src: string }) => {
  return <img src={src} />
}

const Media = (props: any) => {
  const { contentState, block } = props
  const blockEntity = block.getEntityAt(0)

  if (!blockEntity) { return null }

  const entity = contentState.getEntity(blockEntity)
  const { src } = entity.getData()
  const type = entity.getType()

  if (type === 'image') {
    return <Image src={src} />
  }

  return null
}

export default Media