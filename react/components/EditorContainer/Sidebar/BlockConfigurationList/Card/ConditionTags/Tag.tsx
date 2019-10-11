import React from 'react'
import { Tag as StyleguideTag } from 'vtex.styleguide'

import CalendarIcon from '../../../../../../icons/CalendarIcon'
import PersonIcon from '../../../../../../icons/PersonIcon'

interface Props {
  kind: ConditionSubject
  text: string
  title: string
}

const iconByKind = {
  date: <CalendarIcon />,
  utm: <PersonIcon />,
}

const Tag: React.FunctionComponent<Props> = ({ kind, text, title }) => (
  <StyleguideTag bgColor="#FFFFFF" color="#727273">
    <div className="flex items-center">
      {iconByKind[kind]}

      <span className="mh2 fw5">{title}</span>

      <span className="fw4">{text}</span>
    </div>
  </StyleguideTag>
)

export default React.memo(Tag)
