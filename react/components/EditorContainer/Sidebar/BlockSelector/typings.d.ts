import { SidebarComponent } from '../typings'

export interface NormalizedBlock extends SidebarComponent {
  components: NormalizedBlock[]
  isEditable: boolean
  isSortable: boolean
}

export interface BlocksByRole {
  after: NormalizedBlock[]
  around: NormalizedBlock[]
  before: NormalizedBlock[]
  blocks: NormalizedBlock[]
}
