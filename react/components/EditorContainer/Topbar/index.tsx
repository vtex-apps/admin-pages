import React from 'react'

import BlockPicker from './BlockPicker'
import DeviceSwitcher from './DeviceSwitcher'
import LocaleSelector from './LocaleSelector'
import SidebarVisibilityToggle from './SidebarVisibilityToggle'
import UrlInput from './UrlInput'

import styles from '../EditorContainer.css'

interface Props {
  iframeRuntime: RenderContext
}

const Topbar: React.FunctionComponent<Props> = ({ iframeRuntime }) => (
  <div
    className={`ph5 pv7 f6 ${styles['h-3em']} w-100 bg-muted-5 flex justify-center items-center`}
  >
    <LocaleSelector
      emitter={iframeRuntime.emitter}
      initialLocale={iframeRuntime.culture.locale}
    />

    <div className="ml6 flex flex-grow-1">
      <UrlInput />
    </div>

    <div className="ml6">
      <BlockPicker />
    </div>

    <div className="ml8">
      <DeviceSwitcher device={iframeRuntime.device} />
    </div>

    <div className="ml6">
      <SidebarVisibilityToggle />
    </div>
  </div>
)

export default Topbar
