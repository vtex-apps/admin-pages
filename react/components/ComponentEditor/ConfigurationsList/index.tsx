import React, { Fragment } from 'react'

import ConfigurationCard from './ConfigurationCard'
import CreateButton from './CreateButton'

interface Props {
  activeConfiguration?: ExtensionConfiguration
  configurations: ExtensionConfiguration[]
  iframeContext: RenderRuntime['context']
  iframeWindow: Window
  isDisabledChecker: (configuration: ExtensionConfiguration) => boolean
  onCreate: (event: Event) => void
  onEdit: (configuration: ExtensionConfiguration) => void
  onSelect: (configuration: ExtensionConfiguration) => void
}

const ConfigurationsList: React.SFC<Props> = ({
  activeConfiguration,
  configurations,
  iframeContext,
  isDisabledChecker,
  onCreate,
  onEdit,
  onSelect,
}) => (
  <Fragment>
    {configurations.map(
      (configuration: ExtensionConfiguration, index: number) => (
        <Fragment key={index}>
          <ConfigurationCard
            activeConfiguration={activeConfiguration}
            configuration={configuration}
            iframeContext={iframeContext}
            isDisabled={isDisabledChecker(configuration)}
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
