import React, { Dispatch, SetStateAction, useReducer, useState } from 'react'
import { DropEvent, DropzoneOptions, useDropzone } from 'react-dropzone'
import { matchPath, RouteComponentProps, withRouter } from 'react-router'
import {
  ActionMenu,
  ButtonWithIcon,
  Dropdown,
  IconOptionsDots,
  IconUpload,
  Input,
  Tab,
  Tabs,
} from 'vtex.styleguide'

import StyleEditorHeader from '../StyleEditorHeader'
import { EditorPath } from '../StyleEditorRouter'

enum FontItemStyle {
  thin = 'Thin',
  extra_light = 'Extra Light',
  light = 'Light',
  regular = 'Regular',
  medium = 'Medium',
  bold = 'Bold',
  extra_bold = 'Extra Bold',
  black = 'Black',
  thin_italic = 'Thin Italic',
  extra_light_italic = 'Extra Light Italic',
  light_italic = 'Light Italic',
  regular_italic = 'Regular Italic',
  medium_italic = 'Medium Italic',
  bold_italic = 'Bold Italic',
  extra_bold_italic = 'Extra Bold Italic',
  black_italic = 'Black Italic',
}

interface FontFile extends File {
  style?: FontItemStyle
}

interface FontFileAppend {
  type: 'append'
  files: FontFile[]
}

interface FontFileRemove {
  type: 'remove'
  index: number
}

interface FontFileUpdate {
  type: 'update'
  style: FontItemStyle
  index: number
}

type FontFileAction = FontFileAppend | FontFileRemove | FontFileUpdate

interface FontFileItemProps {
  file: File
  onRemove: () => void
  onStyleUpdate: (style: FontItemStyle) => void
  style?: FontItemStyle
}

// Mega == 2 ^ 20
const MEGA = 1048576
const FONT_FILE_EXTENSIONS = ['.woff', '.woff2', '.ttf', '.otf', '.eot', '.svg']

function reducer(prevState: FontFile[], action: FontFileAction): FontFile[] {
  switch (action.type) {
    case 'append':
      return [...prevState, ...action.files]
    case 'remove':
      prevState.splice(action.index, 1)
      return [...prevState]
    case 'update':
      prevState[action.index].style = action.style
      return [...prevState]
  }
}

function canSave(family: string, files: FontFile[]) {
  return family && files.length > 0 && files.every(({ style }) => style != null)
}

const CustomFont: React.FunctionComponent<RouteComponentProps> = ({
  history,
}) => {
  const filesReducer = useReducer(reducer, [])
  const familyState = useState('')

  const enableSave = canSave(familyState[0], filesReducer[0])

  const { customFontFile, customFontLink } = EditorPath
  const { pathname } = history.location
  return (
    <>
      <StyleEditorHeader
        title={'Custom Font'}
        auxButtonLabel={'Save'}
        onAux={enableSave ? () => null : undefined}
      />
      <div className="pa7 h-100 overflow-y-auto flex flex-column">
        <Tabs>
          <Tab
            active={matchPath(customFontFile, pathname) != null}
            onClick={() => history.replace(EditorPath.customFontFile)}
            label="Upload a file"
          >
            <CustomFontFile {...{ familyState, filesReducer }} />
          </Tab>
          <Tab
            active={matchPath(customFontLink, pathname) != null}
            disabled
            onClick={() => history.replace(EditorPath.customFontLink)}
            label="File link"
          />
        </Tabs>
      </div>
    </>
  )
}

interface CustomFontFileProps {
  familyState: [string, Dispatch<SetStateAction<string>>]
  filesReducer: [FontFile[], Dispatch<FontFileAction>]
}

const CustomFontFile: React.FunctionComponent<CustomFontFileProps> = ({
  filesReducer,
  familyState,
}) => {
  const [files, dispatchFiles] = filesReducer
  const [family, setFamily] = familyState

  const removeFile = (index: number) => dispatchFiles({ type: 'remove', index })

  const updateFile = (index: number, style: FontItemStyle) =>
    dispatchFiles({ type: 'update', index, style })

  const onDrop = (
    acceptedFiles: File[],
    rejectedFiles: File[],
    event: DropEvent
  ): void => {
    if (rejectedFiles.length > 0) {
      // TODO: use toast to send warning message
      console.warn(
        'The only supported files are ones under 2MB with types:',
        FONT_FILE_EXTENSIONS.join(' ')
      )
    }

    if (acceptedFiles.length > 0) {
      dispatchFiles({ type: 'append', files: acceptedFiles })
    }
  }

  return (
    <div className="mv6 w-100">
      <Input
        size="small"
        label={'Font Family'}
        value={family}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFamily(e.target.value)
        }
      />
      {files.map((file, index) => (
        <FontFileItem
          file={file}
          onRemove={() => removeFile(index)}
          onStyleUpdate={(style: FontItemStyle) => updateFile(index, style)}
          style={files[index].style}
        />
      ))}
      <FontFileUpload onDrop={onDrop} />
    </div>
  )
}

const FontFileItem: React.FunctionComponent<FontFileItemProps> = ({
  file,
  onRemove,
  onStyleUpdate,
  style,
}) => {
  return (
    <div className="mv5">
      <div className="flex items-center">
        <div className="mv3">{file.name}</div>
        <div className="flex-grow-1" />
        <ActionMenu
          buttonProps={{
            icon: <IconOptionsDots color="currentColor" />,
            variation: 'tertiary',
          }}
          options={[{ label: 'Remove', onClick: onRemove }]}
        />
      </div>
      <div className="flex items-center">
        <div>Weight:</div>
        <Dropdown
          variation="inline"
          options={Object.entries(FontItemStyle).map(([value, label]) => ({
            label,
            value,
          }))}
          onChange={(_: React.ChangeEvent, value: string) =>
            onStyleUpdate(value as FontItemStyle)
          }
          value={style}
        />
      </div>
    </div>
  )
}

interface FontFileUploadProps {
  onDrop: DropzoneOptions['onDrop']
}

const FontFileUpload: React.FunctionComponent<FontFileUploadProps> = ({
  onDrop,
}) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: FONT_FILE_EXTENSIONS,
    maxSize: 2 * MEGA,
    onDrop,
  })
  return (
    <div className="mv6 w-100 flex">
      <p className="t-small">
        Upload you font family files in .ttf or .woff formats.{' '}
        <span className="c-muted-2">(Maximum size 2MB)</span>
      </p>
      <div {...getRootProps()}>
        <ButtonWithIcon icon={<IconUpload />} variation="tertiary">
          Upload
          <input {...getInputProps()} />
        </ButtonWithIcon>
      </div>
    </div>
  )
}

export default withRouter(CustomFont)
