import { SidebarComponent } from '../typings'

export interface NormalizedComponent extends SidebarComponent {
  components: NormalizedComponent[]
  isEditable: boolean
  isSortable: boolean
}

export interface ComponentsByRole {
  after: NormalizedComponent[]
  around: NormalizedComponent[]
  before: NormalizedComponent[]
  blocks: NormalizedComponent[]
}

export interface ReorderChange {
  blocks: Extension['blocks']
  components: NormalizedComponent[]
  target: string
}
