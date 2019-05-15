import React, { Dispatch } from 'react'
import { RouteComponentProps } from 'react-router'
import { Dropdown, Spinner } from 'vtex.styleguide'

import { FormattedMessage } from 'react-intl'
import ListFontsQuery, {
  FontFamily,
  ListFontsQueryResult,
} from '../queries/ListFontsQuery'
import StyleEditorHeader from '../StyleEditorHeader'
import { prettify, prettifyCamelCase } from '../utils/typography'

interface WrapperProps extends RouteComponentProps<TypeTokenParams> {
  config: TachyonsConfig
  onSave: () => void
  updateConfig: (config: DeepPartial<TachyonsConfig>) => void
}

interface Props extends WrapperProps {
  result: ListFontsQueryResult
}

const TypeTokenWrapper: React.FunctionComponent<WrapperProps> = props => {
  return (
    <ListFontsQuery>
      {result => <TypeToken {...props} result={result} />}
    </ListFontsQuery>
  )
}

const TypeToken: React.FunctionComponent<Props> = ({
  match,
  result: { loading, data, error },
  config,
  onSave: saveStyle,
  updateConfig,
}) => {
  const token = match.params.id as keyof TypographyStyles
  const { [token]: font } = config.typography.styles

  if (loading) {
    return (
      <>
        <StyleEditorHeader title={prettify(token)} />
        <div className="pv8 flex justify-center">
          <Spinner />
        </div>
      </>
    )
  }

  if (error != null || data == null) {
    // TODO: add error state
    return <div />
  }

  const dispatch: Dispatch<Partial<Font>> = (fontChange: Partial<Font>) =>
    updateConfig({ typography: { styles: { [token]: fontChange } } })

  const saveLabel = (
    <FormattedMessage
      id="admin/pages.admin.pages.form.button.save"
      defaultMessage="Save"
    />
  )

  return (
    <>
      <StyleEditorHeader
        title={prettify(token)}
        buttonLabel={saveLabel}
        onButtonClick={saveStyle}
      />
      <div className="ph6">
        {Object.keys(font)
          .filter(key => !key.startsWith('__'))
          .map(key => (
            <TypeTokenEntry
              font={font}
              dispatch={dispatch}
              fontFamilies={data.listFonts}
              id={key as keyof Font}
            />
          ))}
      </div>
    </>
  )
}

function getOnChange(key: keyof Font, dispatch: Dispatch<Partial<Font>>) {
  return (_: React.ChangeEvent, value: string) => dispatch({ [key]: value })
}

interface DropdownOption {
  value: string
  label: string
}

function getOptions(
  key: keyof Font,
  font: Font,
  fontFamilies: FontFamily[]
): DropdownOption[] {
  const options = (() => {
    switch (key) {
      case 'fontFamily':
        return fontFamilies.map(({ id, fontFamily }) => ({
          label: fontFamily,
          value: fontFamily,
        }))
      case 'fontWeight':
        return [
          { label: 'Thin', value: '100' },
          { label: 'Extra Light', value: '200' },
          { label: 'Light', value: '300' },
          { label: 'Normal', value: '400' },
          { label: 'Medium', value: '500' },
          { label: 'Semi Bold', value: '600' },
          { label: 'Bold', value: '700' },
          { label: 'Extra Bold', value: '800' },
          { label: 'Black', value: '900' },
        ]
      case 'fontSize':
        return [
          { label: '48px', value: '3rem' },
          { label: '36px', value: '2.25rem' },
          { label: '24px', value: '1.5rem' },
          { label: '20px', value: '1.25rem' },
          { label: '16px', value: '1rem' },
          { label: '14px', value: '.875rem' },
          { label: '12px', value: '.75rem' },
        ]
      case 'letterSpacing':
        return [
          { label: 'Normal', value: 'normal' },
          { label: 'Tracked', value: '.1em' },
          { label: 'Tracked Tight', value: '-.05em' },
          { label: 'Tracked Mega', value: '.25em' },
          { label: 'Zero', value: '0' },
        ]
      case 'textTransform':
        return [
          { label: 'None', value: 'none' },
          { label: 'Capitalize', value: 'capitalize' },
          { label: 'Uppercase', value: 'uppercase' },
          { label: 'Lowercase', value: 'lowercase' },
        ]
    }
  })()

  const currentIfNotInOptions =
    options.find(({ value }) => value === font[key]) == null
      ? [{ label: prettify(font[key]), value: font[key] }]
      : []

  return [...currentIfNotInOptions, ...options]
}

function getValue(key: keyof Font, font: Font): string {
  return font[key]
}

interface EntryProps {
  font: Font
  fontFamilies: FontFamily[]
  id: keyof Font
  dispatch: Dispatch<Partial<Font>>
}

const TypeTokenEntry: React.FunctionComponent<EntryProps> = ({
  font,
  id,
  dispatch,
  fontFamilies,
}) => {
  return (
    <div className="pointer flex justify-between items-center pv6 bb b--muted-4">
      <span className="f4">{prettifyCamelCase(id)}</span>
      <Dropdown
        variation="inline"
        onChange={getOnChange(id, dispatch)}
        options={getOptions(id, font, fontFamilies)}
        value={getValue(id, font)}
      />
    </div>
  )
}

export default TypeTokenWrapper
