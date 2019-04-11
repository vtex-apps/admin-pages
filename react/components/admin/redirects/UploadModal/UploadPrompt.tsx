import React from 'react'
import ReactDropzone from 'react-dropzone'
import { FormattedMessage } from 'react-intl'

import PaperIcon from '../../../icons/PaperIcon'

const InstructionLine: React.FunctionComponent = ({ children }) => (
  <div className="flex mv4">{children}</div>
)

const Field: React.FunctionComponent = ({ children }) => (
  <div className="w3 mr6 code rebel-pink" style={{ minWidth: '4rem' }}>
    {children}
  </div>
)

const Description: React.FunctionComponent = ({ children }) => (
  <div>{children}</div>
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
            Drop here your CSV or{' '}
            <button className="input-reset bg-white bw0 fw5 pa0 c-action-primary pointer">
              choose a file
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
            Download a sample CSV.
          </button>
        </div>
      </ReactDropzone>
      <p>
        <FormattedMessage id="pages.admin.upload.instructions.title" />
      </p>
      <InstructionLine>
        <Field>from</Field>
        <Description>
          User will be redirected when accessing this path.
        </Description>
      </InstructionLine>
      <InstructionLine>
        <Field>to</Field>
        <Description>Path that the user is redirected to.</Description>
      </InstructionLine>
      <InstructionLine>
        <Field>type</Field>
        <Description>
          Can be either <i>temporary</i> (status code 302) or <i>permanent</i>
          (status code 301).
        </Description>
      </InstructionLine>
      <InstructionLine>
        <Field>status</Field>
        <Description>
          Can be <i>active</i> or <i>inactive</i>.
        </Description>
      </InstructionLine>
      <InstructionLine>
        <Field>endDate</Field>
        <Description>
          If the type <i>temporary</i>, it's possible to set and end date. The
          accepted format will be a string in the ISO Date Standard. E.g.,
          2019-04-05T19:19:45.679Z.
        </Description>
      </InstructionLine>
    </>
  )
}

export default React.memo(UploadPrompt)
