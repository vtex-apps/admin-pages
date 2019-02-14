import {
  filter,
  has,
  mapObjIndexed,
  merge,
  mergeDeepRight,
  partition,
} from 'ramda'

export const isNativeProperty = (property: ComponentSchema) => {
  return !!property.type && Object.keys(nativeMap).includes(property.type)
}

export const translateFromNative = (schema: ComponentSchema) => {
  if (has('properties', schema) && schema.properties) {
    const [nativeProperties, nonNativeProperties] = partition(
      isNativeProperty,
      schema.properties
    ) as [ComponentSchemaProperties, ComponentSchemaProperties]

    const translatedNativeProperties = mapObjIndexed(
      (property: ComponentSchema) => {
        const defaultTranslatedProperty = nativeMap[property.type!]
        if (has('elements', property)) {
          const translatedProperty = {
            ...mergeDeepRight(
              defaultTranslatedProperty,
              property.elements || {}
            ),
          }
          return { type: 'object', properties: { ...translatedProperty } }
        }
        return {
          ...mergeDeepRight(defaultTranslatedProperty, property),
          type: defaultTranslatedProperty.type,
        }
      },
      nativeProperties
    )

    schema.properties = merge(nonNativeProperties, translatedNativeProperties)
  }
  return schema
}

const iframe = document.getElementById('store-iframe') || ({} as any)
const pages = iframe.__RUNTIME__ && Object.keys(iframe.__RUNTIME__.pages)

// tslint:disable:object-literal-sort-keys

export const nativeMap: Record<
  string,
  ComponentSchema | ComponentSchemaProperties
> = {
  brand: {
    default: {
      name: 'Default Brand',
      id: 0,
      active: true,
      metaTagDescription: null,
      cacheId: 'default',
      slug: 'default',
      titleTag: null,
    },
    title: 'pages.editor.components.brand.title',
    type: 'string',
    widget: {
      'ui:widget': 'brand-selector',
    },
  },
  category: {
    default: {
      name: 'Default Category',
      id: 0,
      cacheId: 'default',
      href: null,
      slug: 'default',
      titleTag: null,
      hasChildren: false,
      metaTagDescription: null,
      children: null,
    },
    title: 'pages.editor.components.category.title',
    type: 'string',
    widget: {
      'ui:widget': 'category-selector',
    },
  },
  collection: {
    default: {
      name: 'Default Collection',
      id: 0,
      searchable: true,
      highlight: false,
      dateFrom: '06/10/1998',
      dateTo: '02/14/2019',
    },
    title: 'pages.editor.components.collection.title',
    type: 'string',
    widget: {
      'ui:widget': 'collection-selector',
    },
  },
  department: {
    default: {
      name: 'Default Department',
      id: 0,
      cacheId: 'default',
      href: null,
      slug: 'default',
      titleTag: null,
      hasChildren: false,
      metaTagDescription: null,
      children: null,
    },
    title: 'pages.editor.components.department.title',
    type: 'string',
    widget: {
      'ui:widget': 'department-selector',
    },
  },
  image: {
    description: {
      title: 'pages.editor.components.image.description.title',
      type: 'string',
    },
    hasLink: {
      default: false,
      title: 'pages.editor.components.link.hasLink.title',
      type: 'boolean',
    },
    externalRoute: {
      default: false,
      title: 'pages.editor.components.link.externalRoute.title',
      type: 'boolean',
    },
    url: {
      title: 'pages.editor.components.link.url.title',
      type: 'string',
    },
    page: {
      enum: pages,
      title: 'pages.editor.components.link.page.title',
      type: 'string',
    },
    params: {
      title: 'pages.editor.components.link.params.title',
      type: 'string',
    },
    desktop: {
      default:
        'https://openclipart.org/image/2400px/svg_to_png/281769/1497791035.png',
      title: 'pages.editor.components.image.desktop.title',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
    mobile: {
      default:
        'https://openclipart.org/image/2400px/svg_to_png/281769/1497791035.png',
      title: 'pages.editor.components.image.mobile.title',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
  },

  link: {
    hasLink: {
      default: false,
      title: 'pages.editor.components.link.hasLink.title',
      type: 'boolean',
    },
    externalRoute: {
      default: false,
      title: 'pages.editor.components.link.externalRoute.title',
      type: 'boolean',
    },
    url: {
      title: 'pages.editor.components.link.url.title',
      type: 'string',
    },
    page: {
      enum: pages,
      title: 'pages.editor.components.link.page.title',
      type: 'string',
    },
    params: {
      title: 'pages.editor.components.link.params.title',
      type: 'string',
    },
  },

  text: {
    title: 'pages.editor.components.text.title',
    type: 'string',
    widget: {
      'ui:widget': 'textarea',
    },
  },

  video: {
    url: {
      title: 'pages.editor.components.video.url.title',
      type: 'string',
    },
    title: {
      title: 'pages.editor.components.video.title.title',
      type: 'string',
    },
    description: {
      title: 'pages.editor.components.description.url.title',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
  },
}
