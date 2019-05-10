import { SidebarComponent } from '../typings'

import { NormalizedComponent } from './typings'
import { getParentTreePath, isChild, isRootComponent, normalize } from './utils'

describe('getParentTreePath', () => {
  it('returns parent treePath', () => {
    expect(getParentTreePath('store.home/shelf#home')).toBe('store.home')
  })

  it('handles strings with no delimiter', () => {
    expect(getParentTreePath('store')).toBe('store')
  })
})

describe('normalize', () => {
  it('handles empty array inputs', () => {
    const input: SidebarComponent[] = []

    const expectedOutput: NormalizedComponent[] = []

    expect(normalize(input)).toEqual(expectedOutput)
  })

  it('nests store.home/ level components', () => {
    const input: SidebarComponent[] = [
      { name: 'editor.footer.title', treePath: 'store.home/$after_0' },
      { name: 'editor.header.title', treePath: 'store.home/$before_0' },
      {
        name: 'editor.category-menu.title',
        treePath: 'store.home/$before_0/category-menu',
      },
      { name: 'editor.login.title', treePath: 'store.home/$before_0/login' },
      { name: 'editor.menu', treePath: 'store.home/$before_0/menu-link' },
      {
        name: 'editor.minicart.title',
        treePath: 'store.home/$before_0/minicart',
      },
      { name: 'editor.carousel.title', treePath: 'store.home/carousel#home' },
      { name: 'editor.shelf.title', treePath: 'store.home/shelf#home' },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [
          {
            components: [],
            isSortable: false,
            name: 'editor.category-menu.title',
            treePath: 'store.home/$before_0/category-menu',
          },
          {
            components: [],
            isSortable: false,
            name: 'editor.login.title',
            treePath: 'store.home/$before_0/login',
          },
          {
            components: [],
            isSortable: false,
            name: 'editor.menu',
            treePath: 'store.home/$before_0/menu-link',
          },
          {
            components: [],
            isSortable: false,
            name: 'editor.minicart.title',
            treePath: 'store.home/$before_0/minicart',
          },
        ],
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
    ].map(val => expect.objectContaining(val))

    // Don't consider order here
    expect(normalize(input)).toEqual(expect.arrayContaining(expectedOutput))
  })

  it('keep multilevel components', () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        name: 'editor.header.title',
        treePath: 'store.home/$before_0/menu',
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store.home/shelf#home/product-summary',
      },
      {
        name: 'editor.product-rating.title',
        treePath: 'store.home/shelf#home/product-summary/product-rating',
      },
      {
        name: 'editor.product-rating.title',
        treePath: 'store.home/shelf#home/product-summary/product-rating/start',
      },
      {
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [
          {
            components: [],
            isSortable: false,
            name: 'editor.header.title',
            treePath: 'store.home/$before_0/menu',
          },
        ],
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        components: [
          {
            components: [
              {
                components: [
                  {
                    components: [],
                    isSortable: false,
                    name: 'editor.product-rating.title',
                    treePath:
                      'store.home/shelf#home/product-summary/product-rating/start',
                  },
                ],
                isSortable: false,
                name: 'editor.product-rating.title',
                treePath:
                  'store.home/shelf#home/product-summary/product-rating',
              },
            ],
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf#home/product-summary',
          },
        ],
        isSortable: false,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
    ]

    expect(normalize(input)).toEqual(expectedOutput)
  })

  it('should treat "closest" node as next root', () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.product-summary.title',
        treePath:
          'store.home/shelf#home/spacer/placeholder/flex/product-summary',
      },
      {
        name: 'editor.product-summary.title',
        treePath:
          'store.home/shelf#home/spacer/placeholder/flex/product-summary/star',
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [
          {
            components: [
              {
                components: [],
                isSortable: false,
                name: 'editor.product-summary.title',
                treePath:
                  'store.home/shelf#home/spacer/placeholder/flex/product-summary/star',
              },
            ],
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath:
              'store.home/shelf#home/spacer/placeholder/flex/product-summary',
          },
        ],
        isSortable: false,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
    ]

    expect(normalize(input)).toEqual(expectedOutput)
  })

  it('handles unordered components', () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store.home/shelf#home/product-summary',
      },
      {
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [],
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        components: [
          {
            components: [],
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf#home/product-summary',
          },
        ],
        isSortable: false,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
    ]

    expect(normalize(input)).toEqual(expectedOutput)
  })

  it(`handles components with 'around' blocks`, () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store.home/shelf#home/product-summary',
      },
      {
        name: 'editor.around-shelf.title',
        treePath: 'store.home/shelf#home/$around_0',
      },
      {
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        name: 'editor.around-carousel.title',
        treePath: 'store.home/carousel#home/$around_0',
      },
      {
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [],
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.around-carousel.title',
        treePath: 'store.home/carousel#home/$around_0',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.around-shelf.title',
        treePath: 'store.home/shelf#home/$around_0',
      },
      {
        components: [
          {
            components: [],
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf#home/product-summary',
          },
        ],
        isSortable: false,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        components: [],
        isSortable: false,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
    ]

    expect(normalize(input)).toEqual(expectedOutput)
  })

  it('should handle treePaths with same beginning but that are different blocks', () => {
    const input: SidebarComponent[] = [
      {
        name: 'editor.carousel.title',
        treePath: 'store.home/layout#home',
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store.home/layout#homeCollection',
      },
      {
        name: 'editor.product-summary.title',
        treePath: 'store.home/layout#homeCollection/button',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [],
        isSortable: false,
        name: 'editor.carousel.title',
        treePath: 'store.home/layout#home',
      },
      {
        components: [
          {
            components: [],
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/layout#homeCollection/button',
          },
        ],
        isSortable: false,
        name: 'editor.product-summary.title',
        treePath: 'store.home/layout#homeCollection',
      },
    ]
    const output = normalize(input)

    expect(output).toEqual(expectedOutput)
  })
})

describe('isRootComponent', () => {
  it(`returns true when called with 'store.home/header.full'`, () => {
    const input: SidebarComponent = {
      name: 'header',
      treePath: 'store.home/header.full',
    }

    const expectedOutput = true

    expect(isRootComponent(2)(input)).toBe(expectedOutput)
  })

  it(`returns true when called with 'store.home/footer'`, () => {
    const input: SidebarComponent = {
      name: 'footer',
      treePath: 'store.home/footer',
    }

    const expectedOutput = true

    expect(isRootComponent(2)(input)).toBe(expectedOutput)
  })

  it(`returns true when called with 'store.home/test'`, () => {
    const input: SidebarComponent = {
      name: 'test',
      treePath: 'store.home/test',
    }

    const expectedOutput = true

    expect(isRootComponent(2)(input)).toBe(expectedOutput)
  })

  it(`returns false when called with 'store.home/header/login'`, () => {
    const input: SidebarComponent = {
      name: 'login',
      treePath: 'store.home/header.full/login',
    }

    const expectedOutput = false

    expect(isRootComponent(2)(input)).toBe(expectedOutput)
  })

  it(`returns false when called with 'store.home/shelf/product-summary'`, () => {
    const input: SidebarComponent = {
      name: 'product-summary',
      treePath: 'store.home/shelf/product-summary',
    }

    const expectedOutput = false

    expect(isRootComponent(2)(input)).toBe(expectedOutput)
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

describe('isChild', () => {
  it('should return true for direct child tree paths', () => {
    expect(isChild('home', 'home/shelf')).toBe(true)
  })

  it('should return true when root ends with "/"', () => {
    expect(isChild('home/', 'home/shelf')).toBe(true)
  })

  it('should return true for nested child', () => {
    expect(
      isChild('home', 'home/shelf/product-summary/product-description/text')
    ).toBe(true)
  })

  it('should return false when root is empty', () => {
    expect(isChild('', 'home/shelf')).toBe(false)
  })

  it('should return false when passing the same tree path', () => {
    expect(isChild('home/layout#home', 'home/layout#home')).toBe(false)
  })

  it('should return false when the child block has the same start as the root', () => {
    expect(
      isChild('home/layout#home', 'home/layout#homeCollection/shelf')
    ).toBe(false)
  })
})
