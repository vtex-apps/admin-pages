import React from 'react'
import { Badge, Card, IconOptionsDots } from 'vtex.styleguide'

import Colors from './Colors'
import Typography from './Typography'

interface Props {
  checked: boolean
  onChange: (style?: Style) => void
  style: Style
}

const StyleCard: React.SFC<Props> = ({style, checked, onChange}) => {
  const { name, colors, typography } = style

  return (
    <div className="ph3 pb3">
      <Card noPadding>
        <div className="ph5 pt5 pb2" onClick={() => { onChange(style) }}>
          <div className="flex justify-between items-center mb5">
            <Colors colors={colors} />
            <Typography typography={typography}/>
          </div>
          <div className="flex justify-between items-center mb2">
            <div className="flex items-center h2">
              <span className="hf5 mr3">{ name }</span>
              {
                checked
                ? <Badge
                    bgColor="#F71963"
                    color="#FFFFFF"
                  >
                    Current Theme
                  </Badge>
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
