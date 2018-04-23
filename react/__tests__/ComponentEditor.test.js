import React from 'react'
import { MockedProvider } from 'react-apollo/test-utils'
import ComponentEditor from '../components/ComponentEditor'

import { mount } from 'enzyme'

describe('<ComponentEditor /> component', () => {
  const componentMock = {}

  const defaultConfiguration = {}

  function renderComponent(customProps) {
    const componentName = 'example_component'
    const props = {}
    const treePath = ''

    const component = mount(
      <MockedProvider>
        <ComponentEditor key="editor" component={componentName} props={props} treePath={treePath}/>
      </MockedProvider>
    )

    return {
      component
    }
  }

  beforeEach(() => {
    /* Set up the list of components retrieved by the graphQL api */ 
    global.__RUNTIME__ = {
      components: {
        example_component: [
          'ExampleComponent.js'
        ]
      }
    }
    
    /* Set up the component, mocking the retrieve implementation from graphQL api */
    global.__RENDER_7_COMPONENTS__ = {
      'example_component': {
        schema: {
          component: 'Carousel',
          description: 'A simple component',
          type: 'object',
          repeatProperty: {
            repetition: 2,
            structure: {
              type: 'object',
              title: 'banner',
              properties: {
                image: {
                  type: 'string',
                  title: 'Banner image',
                },
              },
            },
          },
          properties: {
            example: {
              type: 'string',
              title: 'Example Property'
            }
          }
        }
      }
    }
  })

  it('should be ok', () => {
    const { component } = renderComponent()
    expect(component).toBeTruthy()
  })
})