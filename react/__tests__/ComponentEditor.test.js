import React from 'react'
import { IntlProvider } from 'react-intl'
import { MockedProvider } from 'react-apollo/test-utils'
import ComponentEditor from '../components/ComponentEditor'

import { mount } from 'enzyme'

import { range, map, clone, indexBy, prop } from 'ramda'

process.env.NODE_ENV = 'production' // avoid react-intl warnings

describe('<ComponentEditor /> component', () => {
  const staticComponent = 'static_component'
  const dynamicComponent = 'dynamic_component'

  /* Set up the list of components retrieved by the graphQL api */
  global.__RUNTIME__ = {
    components: {
      [staticComponent]: [
        'StaticComponent.js',
      ],
      [dynamicComponent]: [
        'DynamicComponent.js',
      ],
    },
  }

  const localeMessages = {
    'editor.category-menu.title': 'Category Menu',
  }

  function renderComponent(componentName, props = {}) {
    const treePath = ''

    const component = mount(
      <IntlProvider locale="en-US" messages={localeMessages}>
        <MockedProvider>
          <ComponentEditor key="editor" component={componentName} props={props} treePath={treePath} />
        </MockedProvider>
      </IntlProvider>
    )

    return { component }
  }

  describe('with static schema', () => {
    let component

    const schema = {
      component: 'Carousel',
      description: 'A simple component',
      type: 'object',
      properties: {
        example: {
          type: 'string',
          title: 'Example Property',
        },
      },
    }

    beforeEach(() => {
      /* Set up the component, mocking the retrieve implementation from graphQL api */
      global.__RENDER_7_COMPONENTS__ = {
        [staticComponent]: { schema },
      }
    })

    afterEach(() => {
      component.unmount()
    })

    it('should render the correct component', () => {
      component = renderComponent(staticComponent).component
      expect(component).toBeTruthy()
      expect(component.props().children.props.children.props).toBeTruthy()
      expect(component.props().children.props.children.props.component).toBe(staticComponent)
    })

    it('should be consistent to the schema definition', () => {
      component = renderComponent(staticComponent).component
      const { properties: { example } } = schema
      const exampleInput = component.find('input').props()
      expect(exampleInput.label).toBe(example.title)
      expect(exampleInput.type).toBe('text')
    })

    it('should render a number input', () => {
      schema.properties = {
        quantity: {
          type: 'number',
          title: 'Quantity',
        },
      }
      component = renderComponent(staticComponent).component
      const { properties: { quantity } } = schema
      const quantityInput = component.find('input').props()
      expect(quantityInput.label).toBe(quantity.title)
      expect(quantityInput.type).toBe('number')
    })
  })

  describe('with dynamic schema', () => {
    const getSchema = ({ numberOfBanners }) => {
      const repeatBanner = (repetition) => indexBy(prop('title'), map((index) => {
        const property = clone({
          type: 'object',
          title: 'banner',
          properties: {
            image: {
              type: 'string',
              title: 'Banner image',
            },
          },
        })
        property.title = `${property.title}${index}`
        return property
      }, range(1, repetition + 1)))

      const generatedSchema = numberOfBanners && repeatBanner(numberOfBanners)

      return {
        component: 'Dynamic Carousel',
        description: 'A simple Dynamic component',
        type: 'object',
        properties: {
          numberOfBanners: {
            type: 'number',
            title: 'Number of Banners',
          },
          ...generatedSchema,
        },
      }
    }

    let component

    beforeEach(() => {
      /* Set up the component, mocking the retrieve implementation from graphQL api */
      global.__RENDER_7_COMPONENTS__ = {
        [dynamicComponent]: { getSchema },
      }
    })

    afterEach(() => {
      component.unmount()
    })

    it('should render the correct component', () => {
      component = renderComponent(dynamicComponent).component
      expect(component).toBeTruthy()
      expect(component.props().children.props.children.props).toBeTruthy()
      expect(component.props().children.props.children.props.component).toBe(dynamicComponent)
    })

    it('should be consistent to the schema definition', () => {
      const NUMBER_OF_BANNERS = 2
      component = renderComponent(dynamicComponent, {
        numberOfBanners: NUMBER_OF_BANNERS,
      }).component

      const { properties } = getSchema({ numberOfBanners: NUMBER_OF_BANNERS })

      const renderedInputs = component.find('input')

      const NUMBER_OF_PROPERTIES = 1

      expect(renderedInputs.getElements().length).toBe(NUMBER_OF_BANNERS + NUMBER_OF_PROPERTIES)

      const numberOfProperties = renderedInputs.find({ label: properties.numberOfBanners.title }).props()
      expect(numberOfProperties.value).toBe(NUMBER_OF_BANNERS)

      const banner1 = renderedInputs.find({ id: 'root_banner1_image' }).props()
      expect(banner1.label).toBe(properties.banner1.properties.image.title)

      const banner2 = renderedInputs.find({ id: 'root_banner2_image' }).props()
      expect(banner2.label).toBe(properties.banner2.properties.image.title)
    })
  })

  describe('i18l', () => {
    let component

    const schema = {
      title: 'editor.category-menu.title',
      type: 'object',
    }

    beforeEach(() => {
      global.__RENDER_7_COMPONENTS__ = {
        [staticComponent]: {
          schema,
        },
      }
    })

    afterEach(() => {
      component.unmount()
    })

    it('should correctly translate the schema title', () => {
      component = renderComponent(staticComponent).component
      expect(component.containsMatchingElement(<div>Category Menu</div>)).toBe(true)
      expect(component.containsMatchingElement(<div>editor.category-menu.title</div>)).toBe(false)
    })
  })
})
