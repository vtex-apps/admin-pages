import { ComponentsRegistry } from 'vtex.render-runtime'

const COMPONENTS: ComponentsRegistry = {
  'vtex.carousel@2.10.2/Carousel': {
    getSchema: () => ({
      description: 'admin/editor.carousel.description',
      dependencies: {
        autoplay: {
          oneOf: [
            {
              properties: {
                autoplay: {
                  enum: [true],
                },
                autoplaySpeed: {
                  enum: ['2', '3', '4', '5', '6', '7', '8'],
                  isLayout: false,
                  title: 'admin/editor.carousel.autoplaySpeed.title',
                  type: 'string',
                },
              },
            },
          ],
        },
      },
      properties: {
        banners: {
          items: {
            properties: {
              description: {
                default: '',
                title: 'admin/editor.carousel.banner.description.title',
                type: 'string',
              },
              externalRoute: {
                default: false,
                isLayout: false,
                title: 'admin/editor.carousel.banner.externalRoute.title',
                type: 'boolean',
              },
              url: {
                isLayout: false,
                title: 'admin/editor.carousel.bannerLink.url.title',
                type: 'string',
              },
              page: {
                enum: [
                  'store.lists',
                  'store.custom#about-us',
                  'store.home',
                  'store.account',
                  'store.login',
                  'store.product',
                  'store.search',
                  'store.search#brand',
                  'store.search#department',
                  'store.search#category',
                  'store.search#subcategory',
                  'store.search#subcategory-terms',
                  'store.search#custom',
                  'store.search#configurable',
                  'store.orderplaced',
                  'vtex.store@2.x:store.custom#foo',
                  'vtex.store@2.x:store.custom#renato',
                ],
                isLayout: false,
                title: 'admin/editor.carousel.bannerLink.page.title',
                type: 'string',
              },
              params: {
                description:
                  'admin/editor.carousel.bannerLink.params.description',
                isLayout: false,
                title: 'admin/editor.carousel.bannerLink.params.title',
                type: 'string',
              },
              image: {
                default: '',
                title: 'admin/editor.carousel.banner.image.title',
                type: 'string',
                widget: {
                  'ui:widget': 'image-uploader',
                },
              },
              mobileImage: {
                default: '',
                title: 'admin/editor.carousel.banner.mobileImage.title',
                type: 'string',
                widget: {
                  'ui:widget': 'image-uploader',
                },
              },
            },
            title: 'admin/editor.carousel.banner.title',
            type: 'object',
          },
          minItems: 1,
          title: 'admin/editor.carousel.banners.title',
          type: 'array',
        },
        height: {
          default: 420,
          enum: [420, 440],
          isLayout: true,
          title: 'admin/editor.carousel.height.title',
          type: 'number',
        },
        showArrows: {
          default: true,
          isLayout: true,
          title: 'admin/editor.carousel.showArrows.title',
          type: 'boolean',
        },
        showDots: {
          default: true,
          isLayout: true,
          title: 'admin/editor.carousel.showDots.title',
          type: 'boolean',
        },
        autoplay: {
          default: true,
          isLayout: false,
          title: 'admin/editor.carousel.autoplay.title',
          type: 'boolean',
        },
      },
      title: 'admin/editor.carousel.title',
      type: 'object',
    }),
  },
  'vtex.product-summary@2.31.0/ProductSummaryCustom': {
    getSchema: () => ({
      title: 'admin/editor.productSummary.title',
      description: 'admin/editor.productSummary.description',
    }),
  },
  'vtex.shelf@1.25.0/Shelf': {
    getSchema: () => ({
      title: 'admin/editor.shelf.title',
      description: 'admin/editor.shelf.description',
      type: 'object',
      properties: {
        category: {
          title: 'admin/editor.shelf.category.title',
          description: 'admin/editor.shelf.category.description',
          type: 'string',
          isLayout: false,
        },
        specificationFilters: {
          title: 'admin/editor.shelf.specificationFilters.title',
          type: 'array',
          items: {
            title: 'admin/editor.shelf.specificationFilters.item.title',
            type: 'object',
            properties: {
              id: {
                type: 'string',
                title: 'admin/editor.shelf.specificationFilters.item.id.title',
              },
              value: {
                type: 'string',
                title:
                  'admin/editor.shelf.specificationFilters.item.value.title',
              },
            },
          },
        },
        collection: {
          title: 'admin/editor.shelf.collection.title',
          type: 'number',
          isLayout: false,
        },
        orderBy: {
          title: 'admin/editor.shelf.orderBy.title',
          type: 'string',
          enum: [
            '',
            'OrderByTopSaleDESC',
            'OrderByPriceDESC',
            'OrderByPriceASC',
            'OrderByNameASC',
            'OrderByNameDESC',
            'OrderByReleaseDateDESC',
            'OrderByBestDiscountDESC',
          ],
          enumNames: [
            'admin/editor.shelf.orderType.relevance',
            'admin/editor.shelf.orderType.sales',
            'admin/editor.shelf.orderType.priceDesc',
            'admin/editor.shelf.orderType.priceAsc',
            'admin/editor.shelf.orderType.nameAsc',
            'admin/editor.shelf.orderType.nameDesc',
            'admin/editor.shelf.orderType.releaseDate',
            'admin/editor.shelf.orderType.discount',
          ],
          default: '',
          isLayout: false,
        },
        productList: {
          title: 'admin/editor.shelf.title',
          description: 'admin/editor.shelf.description',
          type: 'object',
          properties: {
            maxItems: {
              title: 'admin/editor.shelf.maxItems.title',
              type: 'number',
              default: 10,
              isLayout: true,
            },
            gap: {
              title: 'admin/editor.shelf.gap.title',
              type: 'string',
              enum: ['ph0', 'ph3', 'ph5', 'ph7'],
              enumNames: [
                'admin/editor.shelf.gapType.none',
                'admin/editor.shelf.gapType.small',
                'admin/editor.shelf.gapType.medium',
                'admin/editor.shelf.gapType.large',
              ],
              default: 'ph3',
              isLayout: true,
            },
            itemsPerPage: {
              title: 'admin/editor.shelf.itemsPerPage.title',
              type: 'number',
              enum: [3, 4, 5],
              default: 5,
              isLayout: true,
            },
            scroll: {
              title: 'admin/editor.shelf.scrollType.title',
              type: 'string',
              enum: ['BY_PAGE', 'ONE_BY_ONE'],
              enumNames: [
                'admin/editor.shelf.scrollType.byPage',
                'admin/editor.shelf.scrollType.oneByOne',
              ],
              default: 'BY_PAGE',
              isLayout: true,
            },
            arrows: {
              title: 'admin/editor.shelf.arrows.title',
              type: 'boolean',
              default: true,
              isLayout: true,
            },
            showTitle: {
              title: 'admin/editor.shelf.titleText.showTitle',
              type: 'boolean',
              default: true,
              isLayout: true,
            },
          },
        },
        hideUnavailableItems: {
          title: 'admin/editor.shelf.hideUnavailableItems',
          type: 'boolean',
          default: false,
          isLayout: false,
        },
      },
    }),
  },
}

export default COMPONENTS
