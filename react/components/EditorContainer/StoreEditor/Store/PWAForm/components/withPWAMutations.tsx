import React from 'react'
import { Mutation, MutationFn, MutationResult } from 'react-apollo'

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

class UpdateManifestMutation extends Mutation<
  UpdateManifestData,
  UpdateManifestVariables
> {}

interface UpdateManifestIconVariables {
  icon: File
  iOS: boolean
}

class UpdateManifestIconMutation extends Mutation<
  UpdateManifestData,
  UpdateManifestIconVariables
> {}

interface UpdatePWASettingsData {
  settings: PWASettings
}

class UpdatePWASettingsMutation extends Mutation<
  PWASettings,
  UpdatePWASettingsData
> {}

export interface PWAMutationProps {
  updateManifest: {
    mutate: MutationFn<UpdateManifestData, UpdateManifestVariables>
  } & MutationResult<UpdateManifestData>
  updateManifestIcon: {
    mutate: MutationFn<UpdateManifestData, UpdateManifestIconVariables>
  } & MutationResult<UpdateManifestData>
  updatePWASettings: {
    mutate: MutationFn<PWASettings, UpdatePWASettingsData>
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
