import React from 'react'

import Content from './Content'
import ModeSwitcher from './ModeSwitcher'

interface Props {
  editor: EditorContext
  highlightHandler: (treePath: string | null) => void
  runtime: RenderContext
}

const Sidebar: React.SFC<Props> = ({ editor, highlightHandler, runtime }) => (
  <div
    id="sidebar-vtex-editor"
    className="z-1 h-100 top-3em-ns calc--height-ns w-18em-ns w-100 w-auto-ns flex flex-row-reverse"
  >
    <ModeSwitcher editor={editor} />
    <nav
      id="admin-sidebar"
      className="transition animated fadeIn b--light-silver bw1 z-2 h-100 pt8 pt0-ns calc--height-ns overflow-x-hidden w-100 font-display bg-white shadow-solid-x w-18em-ns admin-sidebar"
    >
      <div className="h-100 overflow-y-scroll">
        <Content
          editor={editor}
          highlightHandler={highlightHandler}
          runtime={runtime}
        />
      </div>
    </nav>
  </div>
)

export default Sidebar
