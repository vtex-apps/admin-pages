import * as React from 'react'

import { Link } from 'draft-js'

const Link = (props: Link) => {
  const { contentState, entityKey, children } = props
  const { url } = contentState.getEntity(entityKey).getData()

  return (
    <a href={url} className="blue">
      {children}
    </a>
  )
}

export default Link
