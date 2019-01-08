import React from 'react'
import { Card, IconOptionsDots, Tag } from 'vtex.styleguide'

import Colors from './Colors'
import Typography from './Typography'

interface Props {
  checked: boolean
  onChange: (style?: Style) => void
  style: Style
}

const StyleCard: React.SFC<Props> = ({style, checked, onChange}) => {
  const { name, config: { semanticColors: { background }, typography: { styles: { heading_2 } } } } = style

  return (
    <div className="ph3 pb3">
      <Card noPadding>
        <div className="ph5 pt5 pb2" onClick={() => { onChange(style) }}>
          <div className="flex justify-between items-center mb5">
            <Colors colors={background} />
            <Typography typography={heading_2}/>
          </div>
          <div className="flex justify-between items-center mb2">
            <div className="flex items-center h2">
              <span className="hf5 mr3">{ name }</span>
              {
                checked
                ? <Tag
                    bgColor="#F71963"
                    color="#FFFFFF"
                  >
                    Current Theme
                  </Tag>
                : null
              }
            </div>
            <IconOptionsDots />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default StyleCard
