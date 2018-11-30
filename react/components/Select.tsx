import React, { Fragment } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import ReactSelect, { Option } from 'react-select'
import {
  IconCaretDown,
  IconCaretUp,
} from 'vtex.styleguide'

interface SelectProps {
  errorMessage?: string
  onChange: (options: string[]) => void
  options: Option[]
  value: string[]
}

type Props = SelectProps & InjectedIntlProps

const Select: React.SFC<Props> = ({errorMessage, onChange, options, intl, value}) => (
  <Fragment>
    <ReactSelect
          className={`f6 ${
            !!errorMessage
              ? 'b--danger bw1'
              : ''
          }`}
          arrowRenderer={(
            { onMouseDown, isOpen }: any, // ArrowRendererProps isn't defining isOpen.
          ) => (
            <div onMouseDown={onMouseDown}>
              {isOpen ? (
                <IconCaretUp color="#134cd8" size={8} />
              ) : (
                <IconCaretDown color="#134cd8" size={8} />
              )}
            </div>
          )}
          multi
          onChange={optionValues => {
            const formattedValue = (optionValues as Option[]).map(
              (item: Option) => item.value as string,
            )
            onChange(formattedValue)
          }}
          options={options}
          style={
            !!errorMessage
              ? {
                  borderColor: '#ff4c4c',
                  borderWidth: '.125rem',
                }
              : {}
          }
          placeholder={
            <span className="ml2">
              {intl.formatMessage({
                id: 'pages.editor.components.conditions.custom.placeholder',
              })}
            </span>
          }
          value={value}
        />
      {!!errorMessage && (
        <span className="c-danger f6 mt3 lh-title">
          {intl.formatMessage({
            id: errorMessage,
          })}
        </span>
      )}
  </Fragment>
)

export default injectIntl(Select)
