import React, { Component } from 'react'
import { Mutation, MutationFunction, MutationResult, MutationComponentOptions } from 'react-apollo'

import UpdateManifest from '../mutations/UpdateManifest.graphql'
import UpdateManifestIcon from '../mutations/UpdateManifestIcon.graphql'
import UpdatePWASettings from '../mutations/UpdatePWASettings.graphql'

import { PWASettings } from './withPWASettings'

export interface ManifestMutationData {
  start_url: string
  theme_color: string
  background_color: string
  display: string
  orientation: string
}

interface UpdateManifestData {
  manifest: ManifestMutationData
}

interface UpdateManifestVariables {
  manifest: ManifestMutationData
}

class UpdateManifestMutation extends Component<MutationComponentOptions<UpdateManifestData, UpdateManifestVariables>> {
  render() {
    const { children, ...rest } = this.props
    return (
      <Mutation<UpdateManifestData, UpdateManifestVariables> {...rest}>
        {(mutationFn, result) => children(mutationFn, result)}
      </Mutation>
    )
  }
}

interface UpdateManifestIconVariables {
  icon: File
  iOS: boolean
}

class UpdateManifestIconMutation extends Component<MutationComponentOptions<UpdateManifestData, UpdateManifestIconVariables>> {
  render() {
    const { children, ...rest } = this.props
    return (
      <Mutation<UpdateManifestData, UpdateManifestIconVariables> {...rest}>
        {(mutationFn, result) => children(mutationFn, result)}
      </Mutation>
    )
  }
}

interface UpdatePWASettingsData {
  settings: PWASettings
}

class UpdatePWASettingsMutation extends Component<MutationComponentOptions<PWASettings, UpdatePWASettingsData>> {
  render() {
    const { children, ...rest } = this.props
    return (
      <Mutation<PWASettings, UpdatePWASettingsData> {...rest}>
        {(mutationFn, result) => children(mutationFn, result)}
      </Mutation>
    )
  }
}

export interface PWAMutationProps {
  updateManifest: {
    mutate: MutationFunction<UpdateManifestData, UpdateManifestVariables>
  } & MutationResult<UpdateManifestData>
  updateManifestIcon: {
    mutate: MutationFunction<UpdateManifestData, UpdateManifestIconVariables>
  } & MutationResult<UpdateManifestData>
  updatePWASettings: {
    mutate: MutationFunction<PWASettings, UpdatePWASettingsData>
  } & MutationResult<PWASettings>
}

const withPWAMutations = <T extends {}>(
  WrappedComponent: React.ComponentType<T & PWAMutationProps>
) => {
  const ComponentWithPWAMutations = (props: T) => (
    <UpdateManifestMutation mutation={UpdateManifest}>
      {(updateManifestMutate, updateManifestRest) => (
        <UpdateManifestIconMutation mutation={UpdateManifestIcon}>
          {(updateManifestIconMutate, updateManifestIconRest) => (
            <UpdatePWASettingsMutation mutation={UpdatePWASettings}>
              {(updatePWASettingsMutate, updatePWASettingsRest) => (
                <WrappedComponent
                  {...props}
                  updateManifest={{
                    mutate: updateManifestMutate,
                    ...updateManifestRest,
                  }}
                  updateManifestIcon={{
                    mutate: updateManifestIconMutate,
                    ...updateManifestIconRest,
                  }}
                  updatePWASettings={{
                    mutate: updatePWASettingsMutate,
                    ...updatePWASettingsRest,
                  }}
                />
              )}
            </UpdatePWASettingsMutation>
          )}
        </UpdateManifestIconMutation>
      )}
    </UpdateManifestMutation>
  )

  return ComponentWithPWAMutations
}

export default withPWAMutations
