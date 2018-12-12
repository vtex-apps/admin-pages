import { NormalizedComponent, SidebarComponent } from '../typings'

import {
  defineSortability,
  getParentTreePath,
  isStoreLevelChildComponent,
  isStoreLevelComponent,
  isTopLevelComponent,
  normalizeComponents,
} from './utils'

describe('normalizeComponents', () => {
  it('handles empty array inputs', () => {
    const input: SidebarComponent[] = []

    const expectedOutput: NormalizedComponent[] = []

    expect(normalizeComponents(input)).toEqual(expectedOutput)
  })

  it('nests store-level components', () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.menu',
        treePath: 'store/header/menu-link',
      },
      {
        name: 'editor.header.title',
        treePath: 'store/header',
      },
      {
        name: 'editor.minicart.title',
        treePath: 'store/header/minicart',
      },
      {
        name: 'editor.login.title',
        treePath: 'store/header/login',
      },
      {
        name: 'editor.category-menu.title',
        treePath: 'store/header/category-menu',
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store/home/carousel',
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store/home/shelf',
      },
      {
        name: 'editor.footer.title',
        treePath: 'store/footer',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [
          {
            name: 'editor.menu',
            treePath: 'store/header/menu-link',
          },
          {
            name: 'editor.minicart.title',
            treePath: 'store/header/minicart',
          },
          {
            name: 'editor.login.title',
            treePath: 'store/header/login',
          },
          {
            name: 'editor.category-menu.title',
            treePath: 'store/header/category-menu',
          },
        ],
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store/header',
      },
      {
        isSortable: true,
        name: 'editor.carousel.title',
        treePath: 'store/home/carousel',
      },
      {
        isSortable: true,
        name: 'editor.shelf.title',
        treePath: 'store/home/shelf',
      },
      {
        isSortable: false,
        name: 'editor.footer.title',
        treePath: 'store/footer',
      },
    ]

    expect(normalizeComponents(input)).toEqual(expectedOutput)
  })

  it('nests regular components', () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.header.title',
        treePath: 'store/header',
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store/home/carousel',
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store/home/shelf',
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store/home/shelf/product-summary',
      },
      {
        name: 'editor.footer.title',
        treePath: 'store/footer',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store/header',
      },
      {
        isSortable: true,
        name: 'editor.carousel.title',
        treePath: 'store/home/carousel',
      },
      {
        components: [
          {
            name: 'editor.product-summary.title',
            treePath: 'store/home/shelf/product-summary',
          },
        ],
        isSortable: true,
        name: 'editor.shelf.title',
        treePath: 'store/home/shelf',
      },
      {
        isSortable: false,
        name: 'editor.footer.title',
        treePath: 'store/footer',
      },
    ]

    expect(normalizeComponents(input)).toEqual(expectedOutput)
  })

  it('handles multilevel nesting', () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.header.title',
        treePath: 'store/header',
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store/home/carousel',
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store/home/shelf',
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store/home/shelf/product-summary',
      },
      {
        name: 'editor.product-rating.title',
        treePath: 'store/home/shelf/product-summary/product-rating',
      },
      {
        name: 'editor.footer.title',
        treePath: 'store/footer',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store/header',
      },
      {
        isSortable: true,
        name: 'editor.carousel.title',
        treePath: 'store/home/carousel',
      },
      {
        components: [
          {
            name: 'editor.product-summary.title',
            treePath: 'store/home/shelf/product-summary',
          },
          {
            name: 'editor.product-rating.title',
            treePath: 'store/home/shelf/product-summary/product-rating',
          },
        ],
        isSortable: true,
        name: 'editor.shelf.title',
        treePath: 'store/home/shelf',
      },
      {
        isSortable: false,
        name: 'editor.footer.title',
        treePath: 'store/footer',
      },
    ]

    expect(normalizeComponents(input)).toEqual(expectedOutput)
  })

  it('handles unordered nestable components', () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.header.title',
        treePath: 'store/header',
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store/home/carousel',
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store/home/shelf/product-summary',
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store/home/shelf',
      },
      {
        name: 'editor.footer.title',
        treePath: 'store/footer',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store/header',
      },
      {
        isSortable: true,
        name: 'editor.carousel.title',
        treePath: 'store/home/carousel',
      },
      {
        components: [
          {
            name: 'editor.product-summary.title',
            treePath: 'store/home/shelf/product-summary',
          },
        ],
        isSortable: true,
        name: 'editor.shelf.title',
        treePath: 'store/home/shelf',
      },
      {
        isSortable: false,
        name: 'editor.footer.title',
        treePath: 'store/footer',
      },
    ]

    expect(normalizeComponents(input)).toEqual(expectedOutput)
  })
})

describe('isStoreLevelComponent', () => {
  it(`returns true when called with 'store/header'`, () => {
    const input: SidebarComponent = {
      name: 'header',
      treePath: 'store/header',
    }

    const expectedOutput = true

    expect(isStoreLevelComponent(input)).toBe(expectedOutput)
  })

  it(`returns true when called with 'store/footer'`, () => {
    const input: SidebarComponent = {
      name: 'footer',
      treePath: 'store/footer',
    }

    const expectedOutput = true

    expect(isStoreLevelComponent(input)).toBe(expectedOutput)
  })

  it(`returns false when called with 'store/home/test'`, () => {
    const input: SidebarComponent = {
      name: 'test',
      treePath: 'store/home/test',
    }

    const expectedOutput = false

    expect(isStoreLevelComponent(input)).toBe(expectedOutput)
  })

  it(`returns false when called with 'store/header/login'`, () => {
    const input: SidebarComponent = {
      name: 'login',
      treePath: 'store/header/login',
    }

    const expectedOutput = false

    expect(isStoreLevelComponent(input)).toBe(expectedOutput)
  })

  it(`returns false when called with 'store/home/shelf/product-summary'`, () => {
    const input: SidebarComponent = {
      name: 'product-summary',
      treePath: 'store/home/shelf/product-summary',
    }

    const expectedOutput = false

    expect(isStoreLevelComponent(input)).toBe(expectedOutput)
  })
})

describe('isTopLevelComponent', () => {
  it(`returns true when called with 'store/header'`, () => {
    const input: SidebarComponent = {
      name: 'header',
      treePath: 'store/header',
    }

    const expectedOutput = true

    expect(isTopLevelComponent(input)).toBe(expectedOutput)
  })

  it(`returns true when called with 'store/footer'`, () => {
    const input: SidebarComponent = {
      name: 'footer',
      treePath: 'store/footer',
    }

    const expectedOutput = true

    expect(isTopLevelComponent(input)).toBe(expectedOutput)
  })

  it(`returns true when called with 'store/home/test'`, () => {
    const input: SidebarComponent = {
      name: 'test',
      treePath: 'store/home/test',
    }

    const expectedOutput = true

    expect(isTopLevelComponent(input)).toBe(expectedOutput)
  })

  it(`returns false when called with 'store/header/login'`, () => {
    const input: SidebarComponent = {
      name: 'login',
      treePath: 'store/header/login',
    }

    const expectedOutput = false

    expect(isTopLevelComponent(input)).toBe(expectedOutput)
  })

  it(`returns false when called with 'store/home/shelf/product-summary'`, () => {
    const input: SidebarComponent = {
      name: 'product-summary',
      treePath: 'store/home/shelf/product-summary',
    }

    const expectedOutput = false

    expect(isTopLevelComponent(input)).toBe(expectedOutput)
  })
})

describe('isStoreLevelChildComponent', () => {
  it(`returns true when treePath starts with 'store/header'`, () => {
    const input: SidebarComponent = {
      name: 'login',
      treePath: 'store/header/login',
    }

    const expectedOutput = true

    expect(isStoreLevelChildComponent(input)).toBe(expectedOutput)
  })

  it(`returns true when treePath starts with 'store/footer'`, () => {
    const input: SidebarComponent = {
      name: 'login',
      treePath: 'store/footer/cards',
    }

    const expectedOutput = true

    expect(isStoreLevelChildComponent(input)).toBe(expectedOutput)
  })

  it(`returns false otherwise`, () => {
    const input: SidebarComponent = {
      name: 'login',
      treePath: 'store/home/shelf',
    }

    const expectedOutput = false

    expect(isStoreLevelChildComponent(input)).toBe(expectedOutput)
  })
})

describe('getParentTreePath', () => {
  it('returns parent treePath (delimiter is "/")', () => {
    expect(getParentTreePath('store/home/shelf')).toBe('store/home')
  })

  it('handles strings with no delimiter ("/")', () => {
    expect(getParentTreePath('store')).toBe('store')
  })
})

describe('defineSortability', () => {
  it('returns isSortable === false for store-level components', () => {
    const input = {
      name: 'header',
      treePath: 'store/header',
    }

    const expectedOutput = {
      ...input,
      isSortable: false,
    }

    expect(defineSortability(input)).toEqual(expectedOutput)
  })

  it('returns isSortable === true for top-level components', () => {
    const input = {
      name: 'shelf',
      treePath: 'store/home/shelf',
    }

    const expectedOutput = {
      ...input,
      isSortable: true,
    }

    expect(defineSortability(input)).toEqual(expectedOutput)
  })

  it('returns isSortable === false for non-top-level components', () => {
    const input = {
      name: 'product-summary',
      treePath: 'store/home/shelf/product-summary',
    }

    const expectedOutput = {
      ...input,
      isSortable: false,
    }

    expect(defineSortability(input)).toEqual(expectedOutput)
  })
})
