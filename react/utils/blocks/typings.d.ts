export type BlockRole = 'after' | 'around' | 'before'

export type BlockRolesForTree = BlockRole | 'blocks'

export interface RelativeBlocks {
  [role: string]: string[] | undefined
}
