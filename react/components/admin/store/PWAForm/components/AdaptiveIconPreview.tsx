import React, { useState, FC } from 'react'
import { RadioGroup } from 'vtex.styleguide'

const masks = {
  none: 'inset(0)',
  circle: 'inset(6.36% round 50%)',
  round: 'inset(6.36% round 34px)',
  square: 'inset(6.36%)',
  drop: 'inset(6.36% round 50% 50% 34px)',
  cylinder: 'inset(6.36% round 50% / 30%)',
  minimum: 'inset(10% round 50%)',
}

interface Props {
  imageURL: string,
}

const AdaptiveIconPreview: FC<Props> = ({ imageURL }) => {
  const [mask, setMask] = useState('none')
  
  const onChangeMask = ( value ) => {
    setMask(value)
  }

  return (
    <>
    <h1>Preview</h1>
    <div>
      <div style={{clipPath: masks[mask], WebkitClipPath: masks[mask], width: '252px', height: '252px', backgroundColor: '#C8C8C8' }}>
        <img alt="Preview of maskable icon" src={imageURL} />
      </div>
    </div>
    <div id="controls">
      <RadioGroup
        hideBorder
        name="Masks"
        options={[
          { value: 'none', label: 'None' },
          { value: 'circle', label: 'Circle' },
          { value: 'rounded', label: 'Rounded Rectangle' },
          { value: 'square', label: 'Square' },
          { value: 'drop', label: 'Drop' },
          { value: 'cylinder', label: 'Cylinder' },
          { value: 'minimum', label: 'Minimum safe area' },
        ]}
        value={mask}
        onChange={(e => onChangeMask(e.currentTarget.value))}
      >

      </RadioGroup>
    </div>
    </>
  )
}

export default AdaptiveIconPreview
