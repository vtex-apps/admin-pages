import { TransitionProps } from 'react-transition-group/Transition'

type Direction = 'left' | 'right'

interface Props {
  children: React.ReactElement
  condition: TransitionProps['in']
}

export interface EnterProps extends Props {
  from: Direction
}

export interface ExitProps extends Props {
  to: Direction
}
