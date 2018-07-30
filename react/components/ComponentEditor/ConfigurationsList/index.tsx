import React, { Fragment } from 'react'

import ConfigurationCard from './ConfigurationCard'
import CreateButton from './CreateButton'

type Props = {
  activeConfiguration?: ExtensionConfiguration
  configurations: ExtensionConfiguration[]
  onCreate: (event: Event) => void
  onEdit: (configuration: ExtensionConfiguration) => void
  onSelect: (configuration: ExtensionConfiguration) => void
}

const ConfigurationsList = ({
  activeConfiguration,
  configurations,
  onCreate,
  onEdit,
  onSelect,
}: Props) => (
  <Fragment>
    {configurations.map(
      (configuration: ExtensionConfiguration, index: number) => (
        <Fragment key={index}>
          <ConfigurationCard
            activeConfiguration={activeConfiguration}
            configuration={configuration}
            onClick={onSelect}
            onEdit={onEdit}
          />
        </Fragment>
      ),
    )}
    <CreateButton onClick={onCreate} />
  </Fragment>
)

export default ConfigurationsList
