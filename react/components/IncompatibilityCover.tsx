import React from 'react'
import { FormattedMessage } from 'react-intl'

interface Props {
  Icon: () => JSX.Element
  pageName: string
}

const IncompatibilityCover: React.SFC<Props> = ({ Icon, pageName }) => (
  <section className="absolute z-max bg-muted-5 w-100 h-100">
    <div className="bg-white flex justify-center mb6 ml-auto mr-auto w-80">
      <div className="flex flex-column items-center justify-center mw6 pa5">
        <div className="w4 h4 mv3 br-100 bg-muted-5 flex items-center justify-center">
          {Icon()}
        </div>
        <h1>
          <FormattedMessage
            id="pages.incompatibility.main-text"
            values={{ pageName }}
          />
        </h1>
        <p className="self-start">
          <FormattedMessage
            id="pages.incompatibility.sub-text"
            values={{ pageName }}
          />
        </p>
        <hr className="w-100" />
        <h5>
          <FormattedMessage id="pages.incompatibility.support-text" />
        </h5>
      </div>
    </div>
  </section>
)

export default IncompatibilityCover
