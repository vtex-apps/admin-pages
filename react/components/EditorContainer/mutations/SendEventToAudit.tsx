import { Mutation, MutationFn, MutationResult } from 'react-apollo'

import SendEventToAudit from '../graphql/SendEventToAudit.graphql'

interface SendEventToAuditData {
  sendEventToAudit: any
}

interface MetaData {
  entityName: string
  entityBeforeAction: string
  entityAfterAction: string
  remoteIpAddress: string
  forwardFromVtexUserAgent: string
}

interface SendEventToAuditInput {
  id: string
  date: string
  mainAccountName: string
  accountName: string
  subjectId: string
  application: string
  workspace: string
  operation: string
  meta: MetaData
}

interface SendEventToAuditVariables {
  input: SendEventToAuditInput
}

export type SendEventToAuditMutationFn = MutationFn<
  SendEventToAuditData,
  SendEventToAuditVariables
>

export interface MutationRenderProps
  extends MutationResult<SendEventToAuditData> {
  sendEventToAudit: SendEventToAuditMutationFn
}

class SendEventToAuditMutation extends Mutation<
  SendEventToAuditData,
  SendEventToAuditVariables
> {
  public static defaultProps = {
    mutation: SendEventToAudit,
  }
}

export default SendEventToAuditMutation
