import React, { Fragment } from 'react'

import ContentContainer from '../../ContentContainer'
import EditorHeader from '../../EditorHeader'
import { getIsDefaultContent } from '../../utils'
import Card from './Card'
import CreateButton from './CreateButton'

interface Props {
  configurations: ExtensionConfiguration[]
  editor: EditorContext
  isDisabledChecker: (configuration: ExtensionConfiguration) => boolean
  isSitewide: boolean
  onClose: () => void
  onDelete: (configuration: ExtensionConfiguration) => void
  onCreate: (event: Event) => void
  onSelect: (configuration: ExtensionConfiguration) => void
  path: string
  title?: string
}

const List: React.FunctionComponent<Props> = ({
  configurations,
  editor,
  isDisabledChecker,
  isSitewide,
  onClose,
  onCreate,
  onDelete,
  onSelect,
  path,
  title,
}) => (
  <Fragment>
    <EditorHeader onClose={onClose} title={title} />
    <ContentContainer isLoading={editor.isLoading}>
      {configurations.map(
        (configuration: ExtensionConfiguration, index: number) => (
          <Card
            configuration={configuration}
            onDelete={() => {
              onDelete(configuration)
            }}
            isDisabled={isDisabledChecker(configuration)}
            isDefaultContent={getIsDefaultContent(configuration)}
            isSitewide={isSitewide}
            key={index}
            onClick={onSelect}
            path={path}
          />
        )
      )}
      <CreateButton onClick={onCreate} />
    </ContentContainer>
  </Fragment>
)

export default List
