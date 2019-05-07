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

// tslint:disable-next-line:max-classes-per-file
class UpdateManifestIconMutation extends Mutation<
  UpdateManifestData,
  UpdateManifestIconVariables
> {}

interface UpdatePWASettingsData {
  settings: PWASettings
}

// tslint:disable-next-line:max-classes-per-file
class UpdatePWASettingsMutation extends Mutation<
  PWASettings,
  UpdatePWASettingsData
> {}

export interface MutationProps {
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

const withPWAMutations = (
  WrappedComponent: React.ComponentType<MutationProps & any>
) => (props: any) => (
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

export default withPWAMutations
