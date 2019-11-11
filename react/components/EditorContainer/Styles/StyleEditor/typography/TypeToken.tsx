import React, { Dispatch } from 'react'
import { FormattedMessage } from 'react-intl'
import { RouteComponentProps } from 'react-router'

import startCase from 'lodash/startCase'
import { Spinner } from 'vtex.styleguide'

import ListFontsQuery, { ListFontsQueryResult } from '../queries/ListFontsQuery'
import StyleEditorHeader from '../StyleEditorHeader'
import TypeTokenDropdown from './TypeTokenDropdown'

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
        <StyleEditorHeader title={startCase(token)} />
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
        title={startCase(token)}
        buttonLabel={saveLabel}
        onButtonClick={saveStyle}
      />
      <div className="ph6">
        {Object.keys(font)
          .filter(key => !key.startsWith('__'))
          .map(key => (
            <TypeTokenDropdown
              font={font}
              dispatch={dispatch}
              fontFamilies={data.listFonts}
              key={key}
              id={key as keyof Font}
            />
          ))}
      </div>
    </>
  )
}

export default TypeTokenWrapper
