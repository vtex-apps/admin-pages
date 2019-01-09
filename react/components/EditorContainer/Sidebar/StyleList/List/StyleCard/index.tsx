import React from 'react'
import { ActionMenu, Card, IconOptionsDots, Tag } from 'vtex.styleguide'

import Colors from './Colors'
import Typography from './Typography'

interface Props {
  checked: boolean
  onChange: (style: Style) => void
  style: Style
}

const StyleCard: React.SFC<Props> = ({style, checked, onChange}) => {
  const { name, config: { semanticColors: { background }, typography: { styles: { heading_2 } } } } = style

  const options = [
    {
      label: 'Select as store style',
      onClick: () => { onChange(style) },
    }
  ]

  return (
    <div className="ph3 pb3">
      <Card noPadding>
        <div className="ph5 pt5 pb2">
          <div className="flex justify-between items-center mb5">
            <Colors colors={background} />
            <Typography typography={heading_2}/>
          </div>
          <div className="flex justify-between items-center mb2">
            <div className="flex items-center h2 w-80">
              <span className="hf5 mr3 truncate">{ name }</span>
              {
                checked
                ? <Tag
                    bgColor="#F71963"
                    color="#FFFFFF"
                  >
                    Current
                  </Tag>
                : null
              }
            </div>
            <ActionMenu
              label="Actions"
              icon={<IconOptionsDots />}
              hideCaretIcon
              buttonProps={{
                icon: true,
                variation: 'tertiary',
              }}
              options={options}
            />
          </div>
        </div>
      </Card>
    </div>
  )
}

export default StyleCard
