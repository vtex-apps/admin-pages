import * as React from 'react'

const Image = ({ src }: { src: string }) => {
  return <img src={src} />
}

const Media = (props: any) => {
  const { contentState, block } = props
  const entity = contentState.getEntity(block.getEntityAt(0))
  const { src } = entity.getData()
  const type = entity.getType()

  if (type === 'image') {
    return <Image src={src} />
  }

  return null
}

export default Media