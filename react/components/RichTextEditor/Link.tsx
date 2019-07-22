import * as React from 'react'

import { ContentState } from 'draft-js'

interface LinkProps {
  children: React.ElementType[]
  contentState: ContentState
  decoratedText: string
  dir: string | null
  entityKey: string
  offsetKey: string
}

const Link = (props: LinkProps) => {
  const { contentState, entityKey, children } = props
  const { url } = contentState.getEntity(entityKey).getData()

  return (
    <a href={url} className="blue">
      {children}
    </a>
  )
}

export default Link
