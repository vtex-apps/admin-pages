import { path } from 'ramda'
import React from 'react'
import { Mutation, MutationFn, MutationResult } from 'react-apollo'

import { handleCornerCases } from '../../utils/utils'
import UpdateManifest from '../mutations/UpdateManifest.graphql'
import UpdateManifestIcon from '../mutations/UpdateManifestIcon.graphql'
import Manifest from '../queries/Manifest.graphql'
import Styles from '../queries/Styles.graphql'

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

export interface MutationProps {
  updateManifest: {
    mutate: MutationFn<UpdateManifestData, UpdateManifestVariables>
  } & MutationResult<UpdateManifestData>
  updateManifestIcon: {
    mutate: MutationFn<UpdateManifestData, UpdateManifestIconVariables>
  } & MutationResult<UpdateManifestData>
}

const withPWAMutations = (
  WrappedComponent: React.ComponentType<MutationProps & any>
) => (props: any) => (
  <UpdateManifestMutation mutation={UpdateManifest}>
    {(updateManifestMutate, updateManifestRest) => (
      <UpdateManifestIconMutation mutation={UpdateManifestIcon}>
        {(updateManifestIconMutate, updateManifestIconRest) => (
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
          />
        )}
      </UpdateManifestIconMutation>
    )}
  </UpdateManifestMutation>
)

export default withPWAMutations
