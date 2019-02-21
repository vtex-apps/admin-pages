import React, { Fragment } from 'react'

import LabelEditor from './LabelEditor'
import VisibilityControls from './VisibilityControls'

interface Props {
  condition: ExtensionConfiguration['condition']
  label?: string
  onConditionChange: (
    changes: Partial<ExtensionConfiguration['condition']>
  ) => void
  onLabelChange: (event: Event) => void
}

const ConditionControls: React.SFC<Props> = ({
  condition,
  label,
  onConditionChange,
  onLabelChange,
}) => (
  <Fragment>
    <div className="pt5 ph5 bt bw1 b--light-silver">
      <LabelEditor onChange={onLabelChange} value={label} />
    </div>
    <div className="mt5 pb5 bt bw1 b--light-silver">
      <VisibilityControls
        condition={condition}
        onConditionChange={onConditionChange}
      />
    </div>
  </Fragment>
)

export default ConditionControls
