import React from 'react'
import { Dropdown } from 'vtex.styleguide'

interface TemplateDropdownProps {
  label: string
  placeholder?: string
  template: string
  detailChangeHandlerGetter: (
    detailName: keyof Route,
  ) => (event: React.ChangeEvent<HTMLInputElement>) => void
  templates: Template[]
  errorMessage?: string
}

type Props = TemplateDropdownProps & ReactIntl.InjectedIntlProps

export const TemplateDropdown: React.SFC<Props> = ({
  intl,
  label,
  template,
  detailChangeHandlerGetter,
  placeholder,
  templates,
  errorMessage
}) => (
  <Dropdown
    label={intl.formatMessage({
      id: label,
    })}
    placeholder={placeholder && intl.formatMessage({
      id: placeholder,
    })}
    options={templates.map(({ id }) => ({ value: id, label: id }))}
    onChange={detailChangeHandlerGetter('template')}
    value={template}
    errorMessage={errorMessage}
  />
)

