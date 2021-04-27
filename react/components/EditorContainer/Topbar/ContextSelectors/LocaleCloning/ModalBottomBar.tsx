import { Button } from 'vtex.styleguide'

type VoidFn = () => void

export interface Props {
  onConfirm: (showToast: VoidFn) => void
  onCancel: VoidFn
}

const ModalBottomBar: React.FC<Props> = ({ onConfirm, onCancel }) => {
  return (
    <div className="flex justify-end">
      <span className="mr4">
        {/* TODO: i18n */}
        <Button onClick={() => onCancel()} variation="secondary">
          Cancel
        </Button>
      </span>

      <Button onClick={onConfirm}>Duplicate</Button>
      {/* TODO: i18n */}
    </div>
  )
}

export default ModalBottomBar
