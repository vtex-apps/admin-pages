import React  from 'react'
import { InjectedIntl, injectIntl } from 'react-intl'
import { Button, IconArrowBack, Input } from 'vtex.styleguide'

import Editor from './Editor'
import { GenerateStyleSheetData } from './queries/GenerateStyleSheet'

interface Props {
  data: GenerateStyleSheetData | null
  hooks: {
    config: [TachyonsConfig, React.Dispatch<Partial<TachyonsConfig>>]
    editing: [boolean, React.Dispatch<React.SetStateAction<boolean>>] 
    name: [string, React.Dispatch<React.SetStateAction<string>>]
    navigation: [NavigationInfo[], React.Dispatch<NavigationUpdate>]
  }
  intl: InjectedIntl
  saveStyle: () => void
  setStyleAsset: (asset: StyleAssetInfo) => void
}

const StyleEditorTools: React.FunctionComponent<Props> = ({
  data,
  hooks: {
    config: [config, updateConfig],
    editing: [editing, setEditing],
    name: [_, setName],
    navigation: [navigation, updateNavigation],
  },
  intl,
  saveStyle,
  setStyleAsset,
}) => {
  const [navInfo] = navigation.slice(-1)
  const {
    backButton: { action, text },
    title,
  } = navInfo

  const onInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = event.target.value
    setName(newTitle)
    updateNavigation({
      info: {
        ...navInfo,
        title: newTitle,
      },
      type: 'update',
    })
  }

  const titleCompoennt =
    editing && navigation.length === 1 ? (
      <Input value={title} onChange={onInputChange} />
    ) : (
      <span className="f3" onDoubleClick={() => setEditing(true)}>
        {title}
      </span>
    )

  const onBack = () => {
    action()
    updateNavigation({
      type: 'pop',
    })
  }

  const onSave = () => {
    setEditing(false)
    saveStyle()
  }

  const saveButtonLabel = intl.formatMessage({
    id: 'pages.editor.styles.editor.tools.save',
  })

  const addNavigation = (info: NavigationInfo) => {
    updateNavigation({ info, type: 'push' })
  }

  return (
    <div className="h-100 flex flex-column">
      <div className="mh6 mt6">
        <div className="flex">
          <div className="pointer flex items-center" onClick={onBack}>
            <IconArrowBack />
            <span className="ml4">{text}</span>
          </div>
        </div>
        <div className="flex justify-between items-center mv4">
          {titleCompoennt}
          <Button variation="tertiary" size="small" onClick={onSave}>
            {saveButtonLabel}
          </Button>
        </div>
      </div>
      <div className="flex flex-column flex-grow-1 overflow-y-auto overflow-x-hidden">
        <Editor
          data={data}
          config={config}
          updateConfig={updateConfig}
          addNavigation={addNavigation}
          setStyleAsset={setStyleAsset}
        />
      </div>
    </div>
  )
}

export default StyleEditorTools
