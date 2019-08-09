import { QueryResult } from 'react-apollo'
import { InjectedIntlProps } from 'react-intl'

import { MutationProps } from './components/withPWAMutations'
import { PWAData } from './components/withPWASettings'

export type PWAFormProps = InjectedIntlProps &
  MutationProps &
  QueryResult &
  PWAData
