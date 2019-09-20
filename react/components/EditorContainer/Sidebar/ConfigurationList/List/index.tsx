import React, { Fragment } from 'react'

import { getIsDefaultContent } from '../../utils'
import EditorHeader from '../../EditorHeader'
import LoaderContainer from '../../LoaderContainer'

import Card from './Card'
import CreateButton from './CreateButton'

interface Props {
  configurations: ExtensionConfiguration[]
  isSitewide: boolean
  onClose: () => void
  onDelete: (configuration: ExtensionConfiguration) => void
  onCreate: (event: Event) => void
  onSelect: (configuration: ExtensionConfiguration) => void
  title?: string
}

const List: React.FunctionComponent<Props> = ({
  configurations,
  isSitewide,
  onClose,
  onCreate,
  onDelete,
  onSelect,
  title,
}) => (
  <Fragment>
    <EditorHeader onClose={onClose} title={title} />

    <LoaderContainer>
      <CreateButton onClick={onCreate} />

      {configurations.map(
        (configuration: ExtensionConfiguration, index: number) => (
          <Card
            configuration={configuration}
            onDelete={() => {
              onDelete(configuration)
            }}
            isDisabled={false}
            isDefaultContent={getIsDefaultContent(configuration)}
            isSitewide={isSitewide}
            key={index}
            onClick={onSelect}
          />
        )
      )}
    </LoaderContainer>
  </Fragment>
)

export default List
