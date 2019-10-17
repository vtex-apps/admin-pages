import { Transition } from 'react-transition-group'

type Direction = 'left' | 'right'

type TransitionProps = React.ComponentPropsWithoutRef<typeof Transition>

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
