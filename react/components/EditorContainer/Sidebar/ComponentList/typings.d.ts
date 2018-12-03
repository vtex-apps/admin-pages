import { SidebarComponent } from '../typings'

export interface NormalizedComponent extends SidebarComponent {
  components?: SidebarComponent[]
}
