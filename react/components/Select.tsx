import React, { Fragment } from 'react'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import ReactSelect from 'react-select'
import { IconCaretDown, IconCaretUp } from 'vtex.styleguide'

import { IndicatorProps } from 'react-select/lib/components/indicators'
import { PlaceholderProps } from 'react-select/lib/components/Placeholder'
import { Props as ReactSelectProps } from 'react-select/lib/Select'

interface SelectProps {
  errorMessage?: string
  onChange: (options: SelectOption | SelectOption[]) => void
  options: SelectOption[]
  value: SelectOption[]
}

type Props = SelectProps & InjectedIntlProps & ReactSelectProps

const DropdownIndicator: React.SFC<IndicatorProps<SelectOption>> = ({innerProps, selectProps}) => {
  return (
    <div className="pr4" {...innerProps}>
      { selectProps.menuIsOpen ? (
        <IconCaretUp color="#134cd8" size={8} />
        ) : (
        <IconCaretDown color="#134cd8" size={8} />
        )}
    </div>
  )
}

const Placeholder: React.SFC<PlaceholderProps<SelectOption>> = ({innerProps, children}) => (
  <span className="ml2 c-muted-2" {...innerProps}>
    {children}
  </span>
)

const Select: React.SFC<Props> = ({
  errorMessage,
  onChange,
  options,
  intl,
  value,
  ...props
}) => (
  <Fragment>
    <ReactSelect
      className={`f6 ${!!errorMessage ? 'b--danger bw1' : ''}`}
      components={{
        DropdownIndicator,
        IndicatorSeparator: () => null,
        Placeholder,
      }}
      isMulti
      onChange={optionValues => {
        if (optionValues) {
          onChange(optionValues)
        }
      }}
      options={options}
      styles={{
        control: (style) => {
          const errorStyle = !!errorMessage
          ? {
              borderColor: '#ff4c4c',
              borderWidth: '.125rem',
            }
          : {}
          return {
            ...style,
            ...errorStyle,
          }
        }
      }}
      placeholder={intl.formatMessage({
        id: 'pages.editor.components.conditions.custom.placeholder',
      })}
      theme={(theme) => ({
        ...theme,
        colors: {
          ...theme.colors,
          primary: '#cacbcc'
        }
      })}
      value={value}
      {...props}
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
