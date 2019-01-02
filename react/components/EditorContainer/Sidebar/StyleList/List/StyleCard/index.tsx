import React from 'react'
import { Card, IconOptionsDots, Radio } from 'vtex.styleguide'

import Colors from './Colors'
import Typography from './Typography'

interface Props {
  checked: boolean
  onChange: (style?: Style) => void
  style: Style
}

const StyleCard: React.SFC<Props> = ({style, checked, onChange}) => {
  const { app, name, colors, typography } = style
  const styleId = [app, name].join('/')

  return (
    <div className="ph3 pb3">
      <Card noPadding>
        <div className="ph4 pt3 pb2">
          <div className="flex justify-between items-center mb6">
            <Colors colors={colors} />
            <Typography typography={typography}/>
          </div>
          <div className="flex justify-between">
            <Radio
              checked={checked}
              id={styleId}
              label={name}
              onChange={() => onChange(style)}
              value={styleId}
            />
            <IconOptionsDots />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default StyleCard
