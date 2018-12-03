import { SidebarComponent } from '../typings'

import { NormalizedComponent } from './typings'
import {
  isStoreLevelChildComponent,
  isStoreLevelComponent,
  isTopLevelComponent,
  normalizeComponents,
} from './utils'

describe('normalizeComponents', () => {
  it('should handle empty array inputs', () => {
    const input: SidebarComponent[] = []

    const expectedOutput: NormalizedComponent[] = []

    expect(normalizeComponents(input)).toEqual(expectedOutput)
  })

  it('should nest store-level components', () => {
    const input = [
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

    const expectedOutput = [
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
        name: 'editor.footer.title',
        treePath: 'store/footer',
      },
    ]

    expect(normalizeComponents(input)).toEqual(expectedOutput)
  })

  it('should nest regular components', () => {
    const input = [
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

    const expectedOutput = [
      {
        name: 'editor.header.title',
        treePath: 'store/header',
      },
      {
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
        name: 'editor.shelf.title',
        treePath: 'store/home/shelf',
      },
      {
        name: 'editor.footer.title',
        treePath: 'store/footer',
      },
    ]

    expect(normalizeComponents(input)).toEqual(expectedOutput)
  })

  it('should handle unordered nestable components', () => {
    const input = [
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

    const expectedOutput = [
      {
        name: 'editor.header.title',
        treePath: 'store/header',
      },
      {
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
        name: 'editor.shelf.title',
        treePath: 'store/home/shelf',
      },
      {
        name: 'editor.footer.title',
        treePath: 'store/footer',
      },
    ]

    expect(normalizeComponents(input)).toEqual(expectedOutput)
  })
})

describe('isStoreLevelComponent', () => {
  it(`should return true when called with 'store/header'`, () => {
    const input = {
      name: 'header',
      treePath: 'store/header',
    }

    expect(isStoreLevelComponent(input)).toBe(true)
  })

  it(`should return true when called with 'store/footer'`, () => {
    const input = {
      name: 'footer',
      treePath: 'store/footer',
    }

    expect(isStoreLevelComponent(input)).toBe(true)
  })

  it(`should return false when called with 'store/home/test'`, () => {
    const input = {
      name: 'test',
      treePath: 'store/home/test',
    }

    expect(isStoreLevelComponent(input)).toBe(false)
  })

  it(`should return false when called with 'store/header/login'`, () => {
    const input = {
      name: 'login',
      treePath: 'store/header/login',
    }

    expect(isStoreLevelComponent(input)).toBe(false)
  })

  it(`should return false when called with 'store/home/shelf/product-summary'`, () => {
    const input = {
      name: 'product-summary',
      treePath: 'store/home/shelf/product-summary',
    }

    expect(isStoreLevelComponent(input)).toBe(false)
  })
})

describe('isTopLevelComponent', () => {
  it(`should return true when called with 'store/header'`, () => {
    const input = {
      name: 'header',
      treePath: 'store/header',
    }

    const expectedOutput = true

    expect(isTopLevelComponent(input)).toBe(expectedOutput)
  })

  it(`should return true when called with 'store/footer'`, () => {
    const input = {
      name: 'footer',
      treePath: 'store/footer',
    }

    const expectedOutput = true

    expect(isTopLevelComponent(input)).toBe(expectedOutput)
  })

  it(`should return true when called with 'store/home/test'`, () => {
    const input = {
      name: 'test',
      treePath: 'store/home/test',
    }

    const expectedOutput = true

    expect(isTopLevelComponent(input)).toBe(expectedOutput)
  })

  it(`should return false when called with 'store/header/login'`, () => {
    const input = {
      name: 'login',
      treePath: 'store/header/login',
    }

    const expectedOutput = false

    expect(isTopLevelComponent(input)).toBe(expectedOutput)
  })

  it(`should return false when called with 'store/home/shelf/product-summary'`, () => {
    const input = {
      name: 'product-summary',
      treePath: 'store/home/shelf/product-summary',
    }

    const expectedOutput = false

    expect(isTopLevelComponent(input)).toBe(expectedOutput)
  })
})

describe('isStoreLevelChildComponent', () => {
  it(`should return true when treePath starts with 'store/header'`, () => {
    const input = {
      name: 'login',
      treePath: 'store/header/login',
    }

    const expectedOutput = true

    expect(isStoreLevelChildComponent(input)).toBe(expectedOutput)
  })

  it(`should return true when treePath starts with 'store/footer'`, () => {
    const input = {
      name: 'login',
      treePath: 'store/footer/cards',
    }

    const expectedOutput = true

    expect(isStoreLevelChildComponent(input)).toBe(expectedOutput)
  })

  it(`should return false otherwise`, () => {
    const input = {
      name: 'login',
      treePath: 'store/home/shelf',
    }

    const expectedOutput = false

    expect(isStoreLevelChildComponent(input)).toBe(expectedOutput)
  })
})
