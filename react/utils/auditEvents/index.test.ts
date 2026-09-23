import { createEventObject, safeSendAuditEvent } from '.'

describe('safeSendAuditEvent', () => {
  const event = createEventObject(
    'Edit content block',
    'content',
    'account',
    'workspace'
  )

  it('sends the event as the mutation input', async () => {
    const sendEventToAudit = jest.fn().mockResolvedValue({})

    await safeSendAuditEvent(sendEventToAudit, event)

    expect(sendEventToAudit).toHaveBeenCalledWith({
      variables: { input: event },
    })
  })

  it('does not reject when the mutation fails', async () => {
    const consoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => undefined)
    const sendEventToAudit = jest
      .fn()
      .mockRejectedValue(new Error('Request failed with status code 403'))

    await expect(
      safeSendAuditEvent(sendEventToAudit, event)
    ).resolves.toBeUndefined()
    expect(consoleError).toHaveBeenCalled()

    consoleError.mockRestore()
  })
})
