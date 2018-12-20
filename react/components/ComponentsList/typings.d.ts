export interface NormalizedComponent extends SidebarComponent {
  components?: SidebarComponent[]
  isSortable: boolean
}

export interface ReorderChange {
  target: string
  order: string[]
}

export interface SidebarComponent {
  name: string
  treePath: string
}
