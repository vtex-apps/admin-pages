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
            isEditable: false,
            isSortable: false,
            name: 'editor.category-menu.title',
            treePath: 'store.home/$before_0/category-menu',
          },
          {
            components: [],
            isEditable: false,
            isSortable: false,
            name: 'editor.login.title',
            treePath: 'store.home/$before_0/login',
          },
          {
            components: [],
            isEditable: false,
            isSortable: false,
            name: 'editor.menu',
            treePath: 'store.home/$before_0/menu-link',
          },
          {
            components: [],
            isEditable: false,
            isSortable: false,
            name: 'editor.minicart.title',
            treePath: 'store.home/$before_0/minicart',
          },
        ],
        isEditable: false,
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        components: [],
        isEditable: false,
        isSortable: false,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        components: [],
        isEditable: false,
        isSortable: false,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        components: [],
        isEditable: false,
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
        name: 'editor.product-rating.start.title',
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
            isEditable: false,
            isSortable: false,
            name: 'editor.header.title',
            treePath: 'store.home/$before_0/menu',
          },
        ],
        isEditable: false,
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        components: [],
        isEditable: false,
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
                    isEditable: false,
                    isSortable: false,
                    name: 'editor.product-rating.start.title',
                    treePath:
                      'store.home/shelf#home/product-summary/product-rating/start',
                  },
                ],
                isEditable: false,
                isSortable: false,
                name: 'editor.product-rating.title',
                treePath:
                  'store.home/shelf#home/product-summary/product-rating',
              },
            ],
            isEditable: false,
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf#home/product-summary',
          },
        ],
        isEditable: false,
        isSortable: false,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        components: [],
        isEditable: false,
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
        name: 'editor.product-summary.star.title',
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
                isEditable: false,
                isSortable: false,
                name: 'editor.product-summary.star.title',
                treePath:
                  'store.home/shelf#home/spacer/placeholder/flex/product-summary/star',
              },
            ],
            isEditable: false,
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath:
              'store.home/shelf#home/spacer/placeholder/flex/product-summary',
          },
        ],
        isEditable: false,
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
        isEditable: false,
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        components: [],
        isEditable: false,
        isSortable: false,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        components: [
          {
            components: [],
            isEditable: false,
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf#home/product-summary',
          },
        ],
        isEditable: false,
        isSortable: false,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        components: [],
        isEditable: false,
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
        isEditable: false,
        isSortable: false,
        name: 'editor.header.title',
        treePath: 'store.home/$before_0',
      },
      {
        components: [],
        isEditable: false,
        isSortable: false,
        name: 'editor.around-carousel.title',
        treePath: 'store.home/carousel#home/$around_0',
      },
      {
        components: [],
        isEditable: false,
        isSortable: false,
        name: 'editor.carousel.title',
        treePath: 'store.home/carousel#home',
      },
      {
        components: [],
        isEditable: false,
        isSortable: false,
        name: 'editor.around-shelf.title',
        treePath: 'store.home/shelf#home/$around_0',
      },
      {
        components: [
          {
            components: [],
            isEditable: false,
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/shelf#home/product-summary',
          },
        ],
        isEditable: false,
        isSortable: false,
        name: 'editor.shelf.title',
        treePath: 'store.home/shelf#home',
      },
      {
        components: [],
        isEditable: false,
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
        isEditable: false,
        isSortable: false,
        name: 'editor.carousel.title',
        treePath: 'store.home/layout#home',
      },
      {
        components: [
          {
            components: [],
            isEditable: false,
            isSortable: false,
            name: 'editor.product-summary.title',
            treePath: 'store.home/layout#homeCollection/button',
          },
        ],
        isEditable: false,
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
        name: 'editor.row.title',
        treePath: 'store.home/flex-layout.row#homeCollections',
      },
      {
        name: 'admin/editor.rich-text.title',
        treePath:
          'store.home/flex-layout.row#homeCollections/flex-layout.col#leftCollection/rich-text#homeCollectionsTitle',
      },
      {
        name: 'admin/editor.info-card.title',
        treePath:
          'store.home/flex-layout.row#homeCollections/flex-layout.col#middleCollection/flex-layout.row#homeCollectionsBottom/info-card#homeBannerDCComics',
      },
      {
        name: 'admin/editor.info-card.title',
        treePath:
          'store.home/flex-layout.row#homeCollections/flex-layout.col#middleCollection/flex-layout.row#homeCollectionsBottom/info-card#homeBannerMarvel',
      },
      {
        name: 'admin/editor.info-card.title',
        treePath:
          'store.home/flex-layout.row#homeCollections/flex-layout.col#middleCollection/flex-layout.row#homeCollectionsTop/info-card#homeBannerAngel',
      },
      {
        name: 'admin/editor.info-card.title',
        treePath:
          'store.home/flex-layout.row#homeCollections/flex-layout.col#middleCollection/flex-layout.row#homeCollectionsTop/info-card#homeBannerSeaHunter',
      },
      {
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
            isEditable: false,
            isSortable: false,
            name: 'admin/editor.rich-text.title',
            treePath:
              'store.home/flex-layout.row#homeCollections/flex-layout.col#leftCollection/rich-text#homeCollectionsTitle',
          },
          {
            components: [],
            isEditable: false,
            isSortable: false,
            name: 'admin/editor.info-card.title',
            treePath:
              'store.home/flex-layout.row#homeCollections/flex-layout.col#middleCollection/flex-layout.row#homeCollectionsBottom/info-card#homeBannerDCComics',
          },
          {
            components: [],
            isEditable: false,
            isSortable: false,
            name: 'admin/editor.info-card.title',
            treePath:
              'store.home/flex-layout.row#homeCollections/flex-layout.col#middleCollection/flex-layout.row#homeCollectionsBottom/info-card#homeBannerMarvel',
          },
          {
            components: [],
            isEditable: false,
            isSortable: false,
            name: 'admin/editor.info-card.title',
            treePath:
              'store.home/flex-layout.row#homeCollections/flex-layout.col#middleCollection/flex-layout.row#homeCollectionsTop/info-card#homeBannerAngel',
          },
          {
            components: [],
            isEditable: false,
            isSortable: false,
            name: 'admin/editor.info-card.title',
            treePath:
              'store.home/flex-layout.row#homeCollections/flex-layout.col#middleCollection/flex-layout.row#homeCollectionsTop/info-card#homeBannerSeaHunter',
          },
          {
            components: [],
            isEditable: false,
            isSortable: false,
            name: 'admin/editor.info-card.title',
            treePath:
              'store.home/flex-layout.row#homeCollections/flex-layout.col#rightCollection/info-card#homeCollectionsDisney',
          },
        ],
        isEditable: false,
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
