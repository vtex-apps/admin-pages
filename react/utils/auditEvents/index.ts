import { v4 as uuidv4 } from 'uuid'

export const createEventObject = (
  operation: string,
  entityName: string,
  subjectId?: any
) => {
  const event = {
    id: uuidv4(),
    date: new Date().toISOString(),
    mainAccountName: (window as any).__RUNTIME__.account,
    accountName: (window as any).__RUNTIME__.account,
    subjectId: subjectId ? subjectId : '',
    application: 'site-editor',
    workspace: (window as any).__RUNTIME__.workspace,
    operation,
    meta: {
      entityName,
      entityBeforeAction: '',
      entityAfterAction: '',
      remoteIpAddress: '0.0.0.0',
      fowardFromVtexUserAgent: 'cms',
    },
  }

  return event
}
