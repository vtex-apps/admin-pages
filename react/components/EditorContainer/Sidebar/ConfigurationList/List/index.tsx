import React, { Fragment } from 'react'

import EditorHeader from '../../EditorHeader'

import Card from './Card'
import CreateButton from './CreateButton'

interface Props {
  configurations: ExtensionConfiguration[]
  editor: EditorContext
  isDisabledChecker: (configuration: ExtensionConfiguration) => boolean
  isSitewide: boolean
  onClose: () => void
  onCreate: (event: Event) => void
  onSelect: (configuration: ExtensionConfiguration) => void
  path: string
  title?: string
}

const List: React.SFC<Props> = ({
  configurations,
  editor,
  isDisabledChecker,
  isSitewide,
  onClose,
  onCreate,
  onSelect,
  path,
  title,
}) => (
  <Fragment>
    <EditorHeader editor={editor} onClose={onClose} title={title} />
    {configurations.map(
      (configuration: ExtensionConfiguration, index: number) => (
        <Fragment key={index}>
          <Card
            configuration={configuration}
            isDisabled={isDisabledChecker(configuration)}
            isSitewide={isSitewide}
            onClick={onSelect}
            path={path}
          />
        </Fragment>
      )
    )}
    <CreateButton onClick={onCreate} />
  </Fragment>
)

export default List
