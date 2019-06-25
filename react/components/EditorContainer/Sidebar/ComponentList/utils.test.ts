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
      {
        isEditable: true,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
      {
        isEditable: true,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        isEditable: true,
        name: 'editor.category-menu.title',
        treePath: 'store.home/$before_0/category-menu',
      },
      {
        isEditable: true,
        name: 'editor.login.title',
        treePath: 'store.home/$before_0/login',
      },
      {
        isEditable: true,
        name: 'editor.menu',
        treePath: 'store.home/$before_0/menu-link',
      },
      {
        isEditable: true,
        name: 'editor.minicart.title',
        treePath: 'store.home/$before_0/minicart',
      },
      {
        isEditable: true,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        isEditable: true,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [
          {
            components: [],
            isEditable: true,
            isSortable: false,
            name: 'editor.category-menu.title',
            treePath: 'store.home/$before_0/category-menu',
          },
          {
            components: [],
            isEditable: true,
            isSortable: false,
            name: 'editor.login.title',
            treePath: 'store.home/$before_0/login',
          },
          {
            components: [],
            isEditable: true,
            isSortable: false,
            name: 'editor.menu',
            treePath: 'store.home/$before_0/menu-link',
          },
          {
            components: [],
            isEditable: true,
            isSortable: false,
            name: 'editor.minicart.title',
            treePath: 'store.home/$before_0/minicart',
          },
        ],
        isEditable: true,
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        components: [],
        isEditable: true,
        isSortable: false,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        components: [],
        isEditable: true,
        isSortable: false,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        components: [],
        isEditable: true,
        isSortable: false,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
    ]

    // Don't consider order here
    expect(normalize(input)).toEqual(expect.arrayContaining(expectedOutput))
  })

  it('preserves multilevel structures', () => {
    const input: SidebarComponent[] = [
      {
        isEditable: true,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        isEditable: true,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0/menu',
      },
      {
        isEditable: true,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        isEditable: true,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        isEditable: true,
        name: 'editor.product-summary.title',
        treePath: 'store.home/shelf#home/product-summary',
      },
      {
        isEditable: true,
        name: 'editor.product-rating.title',
        treePath: 'store.home/shelf#home/product-summary/product-rating',
      },
      {
        isEditable: true,
        name: 'editor.product-rating.start.title',
        treePath: 'store.home/shelf#home/product-summary/product-rating/start',
      },
      {
        isEditable: true,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [
          {
            components: [],
            isEditable: true,
            isSortable: false,
            name: 'editor.header.title',
            treePath: 'store.home/$before_0/menu',
          },
        ],
        isEditable: true,
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        components: [],
        isEditable: true,
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
                    isEditable: true,
                    isSortable: false,
                    name: 'editor.product-rating.start.title',
                    treePath:
                      'store.home/shelf#home/product-summary/product-rating/start',
                  },
                ],
                isEditable: true,
                isSortable: false,
                name: 'editor.product-rating.title',
                treePath:
                  'store.home/shelf#home/product-summary/product-rating',
              },
            ],
            isEditable: true,
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf#home/product-summary',
          },
        ],
        isEditable: true,
        isSortable: false,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        components: [],
        isEditable: true,
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
        isEditable: true,
        name: 'editor.product-summary.title',
        treePath:
          'store.home/shelf#home/spacer/placeholder/flex/product-summary',
      },
      {
        isEditable: true,
        name: 'editor.product-summary.star.title',
        treePath:
          'store.home/shelf#home/spacer/placeholder/flex/product-summary/star',
      },
      {
        isEditable: true,
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
                isEditable: true,
                isSortable: false,
                name: 'editor.product-summary.star.title',
                treePath:
                  'store.home/shelf#home/spacer/placeholder/flex/product-summary/star',
              },
            ],
            isEditable: true,
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath:
              'store.home/shelf#home/spacer/placeholder/flex/product-summary',
          },
        ],
        isEditable: true,
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
        isEditable: true,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
      {
        isEditable: true,
        name: 'editor.product-summary.title',
        treePath: 'store.home/shelf#home/product-summary',
      },
      {
        isEditable: true,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        isEditable: true,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        isEditable: true,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [],
        isEditable: true,
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        components: [],
        isEditable: true,
        isSortable: false,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        components: [
          {
            components: [],
            isEditable: true,
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf#home/product-summary',
          },
        ],
        isEditable: true,
        isSortable: false,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        components: [],
        isEditable: true,
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
        isEditable: true,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        isEditable: true,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        isEditable: true,
        name: 'editor.product-summary.title',
        treePath: 'store.home/shelf#home/product-summary',
      },
      {
        isEditable: true,
        name: 'editor.around-shelf.title',
        treePath: 'store.home/shelf#home/$around_0',
      },
      {
        isEditable: true,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        isEditable: true,
        name: 'editor.around-carousel.title',
        treePath: 'store.home/carousel#home/$around_0',
      },
      {
        isEditable: true,
        name: 'editor.footer.title',
        treePath: 'store.home/$after_0',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [],
        isEditable: true,
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        components: [],
        isEditable: true,
        isSortable: false,
        name: 'editor.around-carousel.title',
        treePath: 'store.home/carousel#home/$around_0',
      },
      {
        components: [],
        isEditable: true,
        isSortable: false,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        components: [],
        isEditable: true,
        isSortable: false,
        name: 'editor.around-shelf.title',
        treePath: 'store.home/shelf#home/$around_0',
      },
      {
        components: [
          {
            components: [],
            isEditable: true,
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf#home/product-summary',
          },
        ],
        isEditable: true,
        isSortable: false,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        components: [],
        isEditable: true,
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
        isEditable: true,
        name: 'editor.carousel.title',
        treePath: 'store.home/layout#home',
      },
      {
        isEditable: true,
        name: 'editor.product-summary.title',
        treePath: 'store.home/layout#homeCollection',
      },
      {
        isEditable: true,
        name: 'editor.product-summary.title',
        treePath: 'store.home/layout#homeCollection/button',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [],
        isEditable: true,
        isSortable: false,
        name: 'editor.carousel.title',
        treePath: 'store.home/layout#home',
      },
      {
        components: [
          {
            components: [],
            isEditable: true,
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/layout#homeCollection/button',
          },
        ],
        isEditable: true,
        isSortable: false,
        name: 'editor.product-summary.title',
        treePath: 'store.home/layout#homeCollection',
      },
    ]
    const output = normalize(input)

    expect(output).toEqual(expectedOutput)
  })

  it('should put components in closest ancestor', () => {
    const input: SidebarComponent[] = [
      {
        isEditable: true,
        name: 'editor.row.title',
        treePath: 'store.home/flex-layout.row#homeCollections',
      },
      {
        isEditable: true,
        name: 'admin/editor.rich-text.title',
        treePath:
          'store.home/flex-layout.row#homeCollections/flex-layout.col#leftCollection/rich-text#homeCollectionsTitle',
      },
      {
        isEditable: true,
        name: 'admin/editor.info-card.title',
        treePath:
          'store.home/flex-layout.row#homeCollections/flex-layout.col#middleCollection/flex-layout.row#homeCollectionsBottom/info-card#homeBannerDCComics',
      },
      {
        isEditable: true,
        name: 'admin/editor.info-card.title',
        treePath:
          'store.home/flex-layout.row#homeCollections/flex-layout.col#middleCollection/flex-layout.row#homeCollectionsBottom/info-card#homeBannerMarvel',
      },
      {
        isEditable: true,
        name: 'admin/editor.info-card.title',
        treePath:
          'store.home/flex-layout.row#homeCollections/flex-layout.col#middleCollection/flex-layout.row#homeCollectionsTop/info-card#homeBannerAngel',
      },
      {
        isEditable: true,
        name: 'admin/editor.info-card.title',
        treePath:
          'store.home/flex-layout.row#homeCollections/flex-layout.col#middleCollection/flex-layout.row#homeCollectionsTop/info-card#homeBannerSeaHunter',
      },
      {
        isEditable: true,
        name: 'admin/editor.info-card.title',
        treePath:
          'store.home/flex-layout.row#homeCollections/flex-layout.col#rightCollection/info-card#homeCollectionsDisney',
      },
    ]

    const expectedOutput: NormalizedComponent[] = [
      {
        components: [
          {
            components: [],
            isEditable: true,
            isSortable: false,
            name: 'admin/editor.rich-text.title',
            treePath:
              'store.home/flex-layout.row#homeCollections/flex-layout.col#leftCollection/rich-text#homeCollectionsTitle',
          },
          {
            components: [],
            isEditable: true,
            isSortable: false,
            name: 'admin/editor.info-card.title',
            treePath:
              'store.home/flex-layout.row#homeCollections/flex-layout.col#middleCollection/flex-layout.row#homeCollectionsBottom/info-card#homeBannerDCComics',
          },
          {
            components: [],
            isEditable: true,
            isSortable: false,
            name: 'admin/editor.info-card.title',
            treePath:
              'store.home/flex-layout.row#homeCollections/flex-layout.col#middleCollection/flex-layout.row#homeCollectionsBottom/info-card#homeBannerMarvel',
          },
          {
            components: [],
            isEditable: true,
            isSortable: false,
            name: 'admin/editor.info-card.title',
            treePath:
              'store.home/flex-layout.row#homeCollections/flex-layout.col#middleCollection/flex-layout.row#homeCollectionsTop/info-card#homeBannerAngel',
          },
          {
            components: [],
            isEditable: true,
            isSortable: false,
            name: 'admin/editor.info-card.title',
            treePath:
              'store.home/flex-layout.row#homeCollections/flex-layout.col#middleCollection/flex-layout.row#homeCollectionsTop/info-card#homeBannerSeaHunter',
          },
          {
            components: [],
            isEditable: true,
            isSortable: false,
            name: 'admin/editor.info-card.title',
            treePath:
              'store.home/flex-layout.row#homeCollections/flex-layout.col#rightCollection/info-card#homeCollectionsDisney',
          },
        ],
        isEditable: true,
        isSortable: false,
        name: 'editor.row.title',
        treePath: 'store.home/flex-layout.row#homeCollections',
      },
    ]

    expect(normalize(input)).toEqual(expectedOutput)
  })
})

describe('isRootComponent', () => {
  it(`returns true when called with 'store.home/header.full'`, () => {
    const input: SidebarComponent = {
      isEditable: true,
      name: 'header',
      treePath: 'store.home/header.full',
    }

    const expectedOutput = true

    expect(isRootComponent(2)(input)).toBe(expectedOutput)
  })

  it(`returns true when called with 'store.home/footer'`, () => {
    const input: SidebarComponent = {
      isEditable: true,
      name: 'footer',
      treePath: 'store.home/footer',
    }

    const expectedOutput = true

    expect(isRootComponent(2)(input)).toBe(expectedOutput)
  })

  it(`returns true when called with 'store.home/test'`, () => {
    const input: SidebarComponent = {
      isEditable: true,
      name: 'test',
      treePath: 'store.home/test',
    }

    const expectedOutput = true

    expect(isRootComponent(2)(input)).toBe(expectedOutput)
  })

  it(`returns false when called with 'store.home/header/login'`, () => {
    const input: SidebarComponent = {
      isEditable: true,
      name: 'login',
      treePath: 'store.home/header.full/login',
    }

    const expectedOutput = false

    expect(isRootComponent(2)(input)).toBe(expectedOutput)
  })

  it(`returns false when called with 'store.home/shelf/product-summary'`, () => {
    const input: SidebarComponent = {
      isEditable: true,
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
