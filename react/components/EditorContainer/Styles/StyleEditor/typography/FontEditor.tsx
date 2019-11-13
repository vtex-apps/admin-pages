import React, { useContext, useReducer, useState } from 'react'
import {
  defineMessages,
  FormattedMessage,
  InjectedIntlProps,
  injectIntl,
} from 'react-intl'
import { matchPath, RouteComponentProps } from 'react-router'
import { Button, Spinner, Tab, Tabs, ToastContext } from 'vtex.styleguide'

import { ApolloError } from 'apollo-client'
import DeleteFontFamily, {
  DeleteFontFamilyFn,
} from '../mutations/DeleteFontFamily'
import SaveFontFamily, {
  FontFileInput,
  SaveFontFamilyFn,
} from '../mutations/SaveFontFamily'
import ListFontsQuery, { ListFontsQueryResult } from '../queries/ListFontsQuery'
import StyleEditorHeader from '../StyleEditorHeader'
import { EditorPath, IdParam } from '../StyleEditorRouter'
import { FontFlavour } from '../utils/typography'
import FileFontEditor from './FileFontEditor'

interface FontFileAppend {
  type: 'append'
  files: FontFileInput[]
}

interface FontFileRemove {
  type: 'remove'
  index: number
}

interface FontFileUpdate {
  type: 'update'
  style: FontFlavour
  index: number
}

export type FontFileAction = FontFileAppend | FontFileRemove | FontFileUpdate

const {
  addFontSuccessMessage,
  fileLinkMessage,
  fileUploadMessage,
  removeFontFailureMessage,
  removeFontSuccessMessage,
} = defineMessages({
  addFontSuccessMessage: {
    defaultMessage: 'Font family saved succesfully.',
    id: 'admin/pages.editor.styles.edit.font-family.add-font-success',
  },
  fileLinkMessage: {
    defaultMessage: 'File link',
    id: 'admin/pages.editor.styles.edit.custom-font.file-link',
  },
  fileUploadMessage: {
    defaultMessage: 'Upload a file',
    id: 'admin/pages.editor.styles.edit.custom-font.file-upload',
  },
  removeFontFailureMessage: {
    defaultMessage: 'Cannot delete font family, because some style uses it.',
    id: 'admin/pages.editor.styles.edit.font-family.remove-font-failure',
  },
  removeFontSuccessMessage: {
    defaultMessage: 'Font family removed succesfully.',
    id: 'admin/pages.editor.styles.edit.font-family.remove-font-success',
  },
})

function reducer(
  prevState: FontFileInput[],
  action: FontFileAction
): FontFileInput[] {
  switch (action.type) {
    case 'append':
      return [...prevState, ...action.files]
    case 'remove':
      prevState.splice(action.index, 1)
      return [...prevState]
    case 'update':
      prevState[action.index] = {
        ...prevState[action.index],
        fontStyle: action.style[0],
        fontWeight: action.style[1],
      }

      return [...prevState]
  }
}

function canSave(family: string, files: FontFileInput[]) {
  return (
    family &&
    files.length > 0 &&
    files.every(
      ({ fontStyle, fontWeight }) => fontStyle != null && fontWeight != null
    )
  )
}

function hasErrorCode(error: ApolloError | void, code: string): boolean {
  if (error == null || error.graphQLErrors == null) {
    return false
  }

  const errorWithCode = error.graphQLErrors.find(
    ({ extensions }) =>
      extensions && extensions.exception && extensions.exception.code === code
  )

  return errorWithCode !== undefined
}

function FontEditorTitle() {
  return (
    <FormattedMessage
      id="admin/pages.editor.styles.edit.custom-font.title"
      defaultMessage="Custom Font"
    />
  )
}

function FontEditorLoading() {
  return (
    <>
      <StyleEditorHeader title={<FontEditorTitle />} />
      <div className="pv8 flex justify-center">
        <Spinner />
      </div>
    </>
  )
}

interface Props
  extends RouteComponentProps<CustomFontParams>,
    InjectedIntlProps,
    ListFontsQueryResult {
  deleteFont: DeleteFontFamilyFn
  saveFont: SaveFontFamilyFn
  mutationError: ApolloError | undefined
  loadingSave: boolean
  loadingDelete: boolean
}

const CustomFont: React.FunctionComponent<Props> = ({
  data,
  deleteFont,
  error,
  intl,
  loading,
  loadingDelete,
  loadingSave,
  history,
  saveFont,
}) => {
  const { customFontFile, customFontLink } = EditorPath
  const { pathname } = history.location

  const match = matchPath<CustomFontParams>(pathname, customFontFile)
  const paramId = match ? match.params.id : undefined

  const fonts = (data && data.listFonts) || []
  const editFamily = fonts.find(
    family => encodeURIComponent(family.id) === paramId
  ) || {
    fontFamily: '',
    fonts: [],
    id: undefined,
  }

  const filesReducer = useReducer(reducer, editFamily.fonts)
  const familyState = useState(editFamily.fontFamily)
  const [id] = useState<string | undefined>(editFamily.id)
  const { showToast } = useContext(ToastContext)

  const [fontFamily] = familyState
  const [fontFiles] = filesReducer

  if (loading) {
    return <FontEditorLoading />
  }

  if (error != null || data == null) {
    // TODO: add error state
    return <div />
  }

  const disableSave =
    !canSave(fontFamily, fontFiles) || loadingSave || loadingDelete

  const onSave = () => {
    saveFont({
      variables: { font: { fontFamily, fontFiles, id } },
    }).then(result => {
      if (result == null || result.data == null) {
        return // TODO: treat errors on delete
      }
      showToast(intl.formatMessage(addFontSuccessMessage))
      history.goBack()
    })
  }

  const disableDelete = loadingSave || loadingDelete
  const onDelete = () => {
    deleteFont({ variables: { id: id as string } })
      .then(() => {
        showToast(intl.formatMessage(removeFontSuccessMessage))
        history.goBack()
      })
      .catch(result => {
        if (hasErrorCode(result, 'USED_FONT_DELETE')) {
          showToast(intl.formatMessage(removeFontFailureMessage))
        }
      })
  }

  const fontFileTabProps = {
    active:
      matchPath(pathname, customFontFile) != null ||
      matchPath(pathname, EditorPath.customFont.replace(IdParam, '')) != null,
    key: 0,
    label: intl.formatMessage(fileUploadMessage),
    onClick: () =>
      history.replace(EditorPath.customFontFile.replace(IdParam, id || '')),
  }

  const fontLinkTabProps = {
    active: matchPath(pathname, customFontLink) != null,
    disabled: true,
    key: 1,
    label: intl.formatMessage(fileLinkMessage),
    onClick: () => history.replace(EditorPath.customFontLink),
  }

  return (
    <>
      <StyleEditorHeader title={<FontEditorTitle />}>
        <div>
          {id != null && (
            <Button
              variation="tertiary"
              size="small"
              isLoading={loadingDelete}
              onClick={onDelete}
              disabled={disableDelete}
            >
              <FormattedMessage
                id="admin/pages.admin.pages.form.button.delete"
                defaultMessage="Delete"
              />
            </Button>
          )}
          <Button
            variation="tertiary"
            size="small"
            isLoading={loadingSave}
            onClick={onSave}
            disabled={disableSave}
          >
            <FormattedMessage
              id="admin/pages.admin.pages.form.button.save"
              defaultMessage="Save"
            />
          </Button>
        </div>
      </StyleEditorHeader>
      <div className="pa7 h-100 overflow-y-auto flex flex-column">
        <Tabs>
          <Tab {...fontFileTabProps}>
            <FileFontEditor {...{ familyState, filesReducer, showToast }} />
          </Tab>
          <Tab {...fontLinkTabProps} />
        </Tabs>
      </div>
    </>
  )
}

type WrapperProps = RouteComponentProps<CustomFontParams> & InjectedIntlProps

const FontEditorWrapper: React.FunctionComponent<WrapperProps> = props => {
  return (
    <ListFontsQuery>
      {queryResult => (
        <DeleteFontFamily>
          {(deleteFont, { loading: deleteLoading, error: deleteError }) => (
            <SaveFontFamily>
              {(saveFont, { loading: saveLoading, error: saveError }) => (
                <CustomFont
                  {...props}
                  {...queryResult}
                  saveFont={saveFont}
                  deleteFont={deleteFont}
                  loadingSave={saveLoading}
                  loadingDelete={deleteLoading}
                  mutationError={deleteError || saveError}
                />
              )}
            </SaveFontFamily>
          )}
        </DeleteFontFamily>
      )}
    </ListFontsQuery>
  )
}

export default injectIntl(FontEditorWrapper)
