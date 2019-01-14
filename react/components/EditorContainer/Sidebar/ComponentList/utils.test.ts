import { SidebarComponent } from '../typings'

import { NormalizedComponent } from './typings'
import {
  getParentTreePath,
  isRootComponent,
  normalizeComponents
} from './utils'

describe('normalizeComponents', () => {
  it('handles empty array inputs', () => {
    const input: SidebarComponent[] = []

    const expectedOutput: NormalizedComponent[] = []

    expect(normalizeComponents(input)).toEqual(expectedOutput)
  })

  it('nests store.home/ level components', () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.menu',
        treePath: 'store.home/header.full/menu-link'
      },
      {
        name: 'editor.header.title',
        treePath: 'store.home/header.full'
      },
      {
        name: 'editor.minicart.title',
        treePath: 'store.home/header.full/minicart'
      },
      {
        name: 'editor.login.title',
        treePath: 'store.home/header.full/login'
      },
      {
        name: 'editor.category-menu.title',
        treePath: 'store.home/header.full/category-menu'
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel'
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf'
      },
      {
        name: 'editor.footer.title',
        treePath: 'store.home/footer'
      }
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [
          {
            isSortable: false,
            name: 'editor.menu',
            treePath: 'store.home/header.full/menu-link'
          },
          {
            isSortable: false,
            name: 'editor.minicart.title',
            treePath: 'store.home/header.full/minicart'
          },
          {
            isSortable: false,
            name: 'editor.login.title',
            treePath: 'store.home/header.full/login'
          },
          {
            isSortable: false,
            name: 'editor.category-menu.title',
            treePath: 'store.home/header.full/category-menu'
          }
        ],
        isSortable: true,
        name: 'editor.header.title',
        treePath: 'store.home/header.full'
      },
      {
        isSortable: true,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel'
      },
      {
        isSortable: true,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf'
      },
      {
        isSortable: true,
        name: 'editor.footer.title',
        treePath: 'store.home/footer'
      }
    ]

    expect(normalizeComponents(input)).toEqual(expectedOutput)
  })

  it('nests regular components', () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.header.title',
        treePath: 'store.home/header.full'
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel'
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf'
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store.home/shelf/product-summary'
      },
      {
        name: 'editor.footer.title',
        treePath: 'store.home/footer'
      }
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        isSortable: true,
        name: 'editor.header.title',
        treePath: 'store.home/header.full'
      },
      {
        isSortable: true,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel'
      },
      {
        components: [
          {
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf/product-summary'
          }
        ],
        isSortable: true,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf'
      },
      {
        isSortable: true,
        name: 'editor.footer.title',
        treePath: 'store.home/footer'
      }
    ]

    expect(normalizeComponents(input)).toEqual(expectedOutput)
  })

  it('handles multilevel nesting', () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.header.title',
        treePath: 'store.home/header.full'
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel'
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf'
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store.home/shelf/product-summary'
      },
      {
        name: 'editor.product-rating.title',
        treePath: 'store.home/shelf/product-summary/product-rating'
      },
      {
        name: 'editor.footer.title',
        treePath: 'store.home/footer'
      }
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        isSortable: true,
        name: 'editor.header.title',
        treePath: 'store.home/header.full'
      },
      {
        isSortable: true,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel'
      },
      {
        components: [
          {
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf/product-summary'
          },
          {
            isSortable: false,
            name: 'editor.product-rating.title',
            treePath: 'store.home/shelf/product-summary/product-rating'
          }
        ],
        isSortable: true,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf'
      },
      {
        isSortable: true,
        name: 'editor.footer.title',
        treePath: 'store.home/footer'
      }
    ]

    expect(normalizeComponents(input)).toEqual(expectedOutput)
  })

  it('handles unordered nestable components', () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.header.title',
        treePath: 'store.home/header.full'
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel'
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store.home/shelf/product-summary'
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf'
      },
      {
        name: 'editor.footer.title',
        treePath: 'store.home/footer'
      }
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        isSortable: true,
        name: 'editor.header.title',
        treePath: 'store.home/header.full'
      },
      {
        isSortable: true,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel'
      },
      {
        components: [
          {
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf/product-summary'
          }
        ],
        isSortable: true,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf'
      },
      {
        isSortable: true,
        name: 'editor.footer.title',
        treePath: 'store.home/footer'
      }
    ]

    expect(normalizeComponents(input)).toEqual(expectedOutput)
  })
})

describe('isRootComponent', () => {
  it(`returns true when called with 'store.home/header.full'`, () => {
    const input: SidebarComponent = {
      name: 'header',
      treePath: 'store.home/header.full'
    }

    const expectedOutput = true

    expect(isRootComponent(input)).toBe(expectedOutput)
  })

  it(`returns true when called with 'store.home/footer'`, () => {
    const input: SidebarComponent = {
      name: 'footer',
      treePath: 'store.home/footer'
    }

    const expectedOutput = true

    expect(isRootComponent(input)).toBe(expectedOutput)
  })

  it(`returns true when called with 'store.home/test'`, () => {
    const input: SidebarComponent = {
      name: 'test',
      treePath: 'store.home/test'
    }

    const expectedOutput = true

    expect(isRootComponent(input)).toBe(expectedOutput)
  })

  it(`returns false when called with 'store.home/header/login'`, () => {
    const input: SidebarComponent = {
      name: 'login',
      treePath: 'store.home/header.full/login'
    }

    const expectedOutput = false

    expect(isRootComponent(input)).toBe(expectedOutput)
  })

  it(`returns false when called with 'store.home/shelf/product-summary'`, () => {
    const input: SidebarComponent = {
      name: 'product-summary',
      treePath: 'store.home/shelf/product-summary'
    }

    const expectedOutput = false

    expect(isRootComponent(input)).toBe(expectedOutput)
  })
})

describe('getParentTreePath', () => {
  it('returns parent treePath (delimiter is "/")', () => {
    expect(getParentTreePath('store.home/shelf')).toBe('store.home')
  })

  it('handles strings with no delimiter ("/")', () => {
    expect(getParentTreePath('store')).toBe('store')
  })
})
