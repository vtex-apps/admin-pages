import { filter, has, mapObjIndexed, merge, mergeDeepRight } from 'ramda'

export const isNativeProperty = (property: ComponentSchema) => {
  return !!property.type && Object.keys(nativeMap).includes(property.type)
}

export const translateFromNative = (schema: ComponentSchema) => {
  if (has('properties', schema) && schema.properties) {
    const nativeProperties = filter(isNativeProperty, schema.properties) as ComponentSchemaProperties
    const nonNativeProperties = filter((property: ComponentSchema) => !isNativeProperty(property), schema.properties) as ComponentSchemaProperties

    const translatedNativeProperties = mapObjIndexed((property: ComponentSchema) => {
      const defaultTranslatedProperty = nativeMap[property.type!]
      if (has('elements', property)) {
        const translatedProperty = { ...mergeDeepRight(defaultTranslatedProperty, property.elements || {}) }
        return { type: 'object', properties: { ...translatedProperty } }
      }
      return {...mergeDeepRight(defaultTranslatedProperty, property), type: defaultTranslatedProperty.type}
    }, nativeProperties)

    schema.properties = merge(nonNativeProperties, translatedNativeProperties)
  }
  return schema
}

const iframe = document.getElementById('store-iframe') || {} as any
const pages = iframe.__RUNTIME__ && Object.keys(iframe.__RUNTIME__.pages)

// tslint:disable:object-literal-sort-keys

export const nativeMap: Record<string, ComponentSchema|ComponentSchemaProperties> = {
  brand: {
    default: 'Default Brand',
    title: 'pages.editor.components.brand.title',
    type: 'string',
    widget: {
      'ui:widget': 'brand-selector'
    }
  },
  category: {
    default: 'Default Category',
    title: 'pages.editor.components.category.title',
    type: 'string',
    widget: {
      'ui:widget': 'category-selector'
    }
  },
  collection: {
    default: 'Default Collection',
    title: 'pages.editor.components.collection.title',
    type: 'string',
    widget: {
      'ui:widget': 'collection-selector'
    }
  },
  department: {
    default: 'Default Department',
    title: 'pages.editor.components.department.title',
    type: 'string',
    widget: {
      'ui:widget': 'department-selector'
    }
  },
  image: {
    description: {
      default: 'pages.editor.components.image.description.default',
      title: 'pages.editor.components.image.description.title',
      type: 'string'
    },
    hasLink: {
      default: false,
      title: 'pages.editor.components.image.hasLink.title',
      type: 'boolean'
    },
    externalRoute: {
      default: 'rota interna',
      enum: [
        'rota interna',
        'rota externa'
      ],
      title: 'pages.editor.components.image.externalRoute.title',
      type: 'string',
    },
    url: {
      default: '',
      title: 'editor.carousel.bannerLink.url.title',
      type: 'string',
    },
    page: {
      default: '',
      enum: pages,
      title: 'editor.carousel.bannerLink.page.title',
      type: 'string',
    },
    params: {
      default: '',
      description: 'editor.carousel.bannerLink.params.description',
      title: 'editor.carousel.bannerLink.params.title',
      type: 'string',
    },
    desktop: {
      default: 'https://openclipart.org/image/2400px/svg_to_png/281769/1497791035.png',
      title: 'pages.editor.components.image.image.desktopImage.title',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
    mobile: {
      default: 'https://openclipart.org/image/2400px/svg_to_png/281769/1497791035.png',
      title: 'pages.editor.components.image.image.mobileImage.title',
      type: 'string',
      widget: {
        'ui:widget': 'image-uploader',
      },
    },
  },

  link: {
    externalRoute: {
      default: '',
      title: 'pages.editor.components.image.externalRoute.title',
      type: 'boolean',
    },
    url: {
      default: '',
      title: 'editor.carousel.bannerLink.url.title',
      type: 'string',
    },
    page: {
      default: '',
      enum: pages,
      title: 'editor.carousel.bannerLink.page.title',
      type: 'string',
    },
    params: {
      default: '',
      description: 'editor.carousel.bannerLink.params.description',
      title: 'editor.carousel.bannerLink.params.title',
      type: 'string',
    },
  },

  text: {
    content: {
      default: 'pages.editor.components.text.content.default',
      title: 'pages.editor.components.text.content.title',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
  },

  video: {
    content: {
      default: '',
      title: 'Vídeo',
      type: 'string',
    },
    // tslint:disable-next-line:object-literal-sort-keys
    title: {
      default: 'título default do vídeo',
      title: 'Título',
      type: 'string',
    },
    // tslint:disable-next-line:object-literal-sort-keys
    description: {
      default: 'descrição do vídeo',
      title: 'Descrição',
      type: 'string',
      widget: {
        'ui:widget': 'textarea',
      },
    },
  }
}
