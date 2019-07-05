import * as React from 'react'

const Link = ({ contentState, entityKey, children }: any) => {
  const { url } = contentState.getEntity(entityKey).getData()

  return (
    <a href={url} className="blue">
      {children}
    </a>
  )
}

export default Link