import React from 'react'
import { Dropdown, Tooltip } from 'vtex.styleguide'
import { useIntl } from 'react-intl'

import { useEditorContext } from '../../../EditorContext'
import { DropdownOptions, DropdownValue } from './typings'

interface Props {
  isDisabled: boolean
  onChange: React.ChangeEventHandler<HTMLSelectElement>
  options: DropdownOptions
  value: DropdownValue
}

const BindingSelector: React.FC<Props> = ({
  isDisabled,
  onChange,
  options,
  value,
}) => {
  const Selector = React.useCallback(
    () => (
      <div
        className={
          'binding-selector' + (isDisabled ? ' binding-selector-disabled' : '')
        }
      >
        <Dropdown
          disabled={isDisabled}
          onChange={onChange}
          options={options}
          size="small"
          value={value}
        />
      </div>
    ),
    [isDisabled, onChange, options, value]
  )

  const editor = useEditorContext()
  const intl = useIntl()

  return editor.editTreePath ? (
    <Tooltip
      label={intl.formatMessage({
        defaultMessage: 'The binding cannot be changed while editing a block.',
        id: 'admin/pages.editor.topbar.context.binding.tooltip',
      })}
      position="bottom"
    >
      <div className="flex">
        <Selector />
      </div>
    </Tooltip>
  ) : (
    <Selector />
  )
}

export default BindingSelector
