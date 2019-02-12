export type BlockRole = 'after' | 'around' | 'before'

export interface RelativeBlocks {
  [role: string]: string[] | undefined
}
