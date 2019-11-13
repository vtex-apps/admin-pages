import React, { Dispatch } from 'react'

import startCase from 'lodash/startCase'
import { Dropdown } from 'vtex.styleguide'

import { FontFamily } from '../queries/ListFontsQuery'
import { getTypeTokenDropdownOptions } from '../utils/typography'

function getOnChange(key: keyof Font, dispatch: Dispatch<Partial<Font>>) {
  return (_: React.ChangeEvent, value: string) => {
    // Workaround since Dropdown does not work well with nil values
    dispatch({ [key]: value === '' ? null : value })
  }
}

function getValue(key: keyof Font, font: Font): string {
  return font[key] || ''
}

interface EntryProps {
  font: Font
  fontFamilies: FontFamily[]
  id: keyof Font
  dispatch: Dispatch<Partial<Font>>
}

const TypeTokenDropdown: React.FunctionComponent<EntryProps> = ({
  font,
  id,
  dispatch,
  fontFamilies,
}) => {
  return (
    <div className="flex justify-between items-center pv6 bb b--muted-4">
      <span className="f4">{startCase(id)}</span>
      <Dropdown
        variation="inline"
        onChange={getOnChange(id, dispatch)}
        options={getTypeTokenDropdownOptions(id, font, fontFamilies)}
        value={getValue(id, font)}
      />
    </div>
  )
}

export default TypeTokenDropdown
