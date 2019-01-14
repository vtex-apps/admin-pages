import { SidebarComponent } from '../typings'

export interface NormalizedComponent extends SidebarComponent {
  components?: NormalizedComponent[]
  isSortable: boolean
}
