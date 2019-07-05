import * as React from 'react'

import { Button, Input } from 'vtex.styleguide'

import StyleButton from './StyleButton'

interface Props {
  onAdd: (link: string) => void
}
const ImageInput = ({ onAdd }: Props) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [imageLink, setImageLink] = React.useState()

  const handleAddImage = () => {
    console.log('----- imageLink:', imageLink);
    
    onAdd(imageLink)
  }

  return (
    <div>
      <StyleButton 
        active={isOpen}
        onToggle={() => setIsOpen(!isOpen)}
        style={{}}
        label={'Image'}
      />

      <div>
        <Input 
          onChange={(e: any) => setImageLink(e.target.value)}
        />

        <Button onClick={handleAddImage}>Add</Button>
      </div>
    </div>
  )
}

export default ImageInput