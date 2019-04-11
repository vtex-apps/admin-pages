import React from 'react'
import ReactDropzone from 'react-dropzone'
import { FormattedMessage } from 'react-intl'

import PaperIcon from '../../../icons/PaperIcon'

const InstructionLine: React.FunctionComponent = ({ children }) => (
  <div className="flex mv4 self-start">{children}</div>
)

const Field: React.FunctionComponent = ({ children }) => (
  <div className="w3 mr6 code rebel-pink" style={{ minWidth: '4rem' }}>
    {children}
  </div>
)

const Description: React.FunctionComponent = ({ children }) => (
  <div>{children}</div>
)

const Parameter: React.FunctionComponent = ({ children }) => (
  <span className="code f6">{children}</span>
)

const UploadPrompt = () => {
  return (
    <>
      <ReactDropzone className="w-100 pv8 ba br3 bw1 b--action-primary b--dashed flex items-center justify-center">
        <div className="flex flex-column items-center justify-center">
          <div className="c-action-primary">
            <PaperIcon />
          </div>
          <p className="tc">
            <FormattedMessage id="pages.admin.redirects.upload-modal.prompt.drop.message" />
            <button className="input-reset bg-white bw0 fw5 pa0 c-action-primary pointer">
              <FormattedMessage id="pages.admin.redirects.upload-modal.prompt.drop.button" />
            </button>
            .
          </p>
          <button
            className="input-reset bg-white bw0 fw5 pa0 c-action-primary pointer ttu"
            onClick={e => {
              e.stopPropagation()
              window.alert('oi')
            }}
          >
            <FormattedMessage id="pages.admin.redirects.upload-modal.prompt.drop.template" />
          </button>
        </div>
      </ReactDropzone>
      <p className="self-start">
        <FormattedMessage id="pages.admin.upload.instructions.title" />
      </p>

      <InstructionLine>
        <Field>from</Field>

        <Description>
          <FormattedMessage id="pages.admin.redirects.upload-modal.prompt.instructions.from" />
        </Description>
      </InstructionLine>

      <InstructionLine>
        <Field>to</Field>

        <Description>
          <FormattedMessage id="pages.admin.redirects.upload-modal.prompt.instructions.to" />
        </Description>
      </InstructionLine>

      <InstructionLine>
        <Field>type</Field>

        <Description>
          <FormattedMessage id="pages.admin.redirects.upload-modal.prompt.instructions.type.intro" />
          <Parameter>temporary</Parameter> (
          <FormattedMessage id="pages.admin.redirects.upload-modal.prompt.instructions.type.status-code" />{' '}
          302){' '}
          <FormattedMessage id="pages.admin.redirects.upload-modal.prompt.instructions.type.or" />{' '}
          <Parameter>permanent</Parameter> (
          <FormattedMessage id="pages.admin.redirects.upload-modal.prompt.instructions.type.status-code" />{' '}
          301).
        </Description>
      </InstructionLine>

      <InstructionLine>
        <Field>status</Field>

        <Description>
          <FormattedMessage id="pages.admin.redirects.upload-modal.prompt.instructions.status.intro" />{' '}
          <Parameter>active</Parameter>{' '}
          <FormattedMessage id="pages.admin.redirects.upload-modal.prompt.instructions.status.active" />
          <FormattedMessage id="pages.admin.redirects.upload-modal.prompt.instructions.status.or" />{' '}
          <Parameter>inactive</Parameter>
          <FormattedMessage id="pages.admin.redirects.upload-modal.prompt.instructions.status.inactive" />
          .
        </Description>
      </InstructionLine>

      <InstructionLine>
        <Field>endDate</Field>

        <Description>
          <FormattedMessage id="pages.admin.redirects.upload-modal.prompt.instructions.end-date.intro" />{' '}
          <Parameter>temporary</Parameter>
          <FormattedMessage id="pages.admin.redirects.upload-modal.prompt.instructions.end-date.rest" />{' '}
          E.g., <Parameter>2019-04-05T19:19:45.679Z</Parameter>.
        </Description>
      </InstructionLine>
    </>
  )
}

export default React.memo(UploadPrompt)
