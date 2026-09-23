import { v4 as uuidv4 } from 'uuid'

export const createEventObject = (
  operation: string,
  entityName: string,
  account: string,
  workspace: string,
  subjectId?: any
) => {
  const event = {
    id: uuidv4(),
    date: new Date().toISOString(),
    mainAccountName: account,
    accountName: account,
    subjectId: subjectId ? subjectId : '',
    application: 'site-editor',
    workspace: workspace,
    operation,
    meta: {
      entityName,
      entityBeforeAction: '',
      entityAfterAction: '',
      remoteIpAddress: '0.0.0.0',
      forwardFromVtexUserAgent: 'cms',
    },
  }

  return event
}

type AuditEvent = ReturnType<typeof createEventObject>

type SendEventToAudit = (options: {
  variables: { input: AuditEvent }
}) => Promise<unknown>

export const safeSendAuditEvent = (
  sendEventToAudit: SendEventToAudit,
  event: AuditEvent
) =>
  sendEventToAudit({ variables: { input: event } }).catch(err => {
    console.error('Failed to send audit event', err)
  })
