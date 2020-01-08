import React from 'react'
import { act } from '@testing-library/react'
import { fireEvent, render } from '@vtex/test-tools/react'

import { State } from './typings'
import HighlightOverlay from './index'

const extensionPointName = 'welcome'

function createMockDiv(width: number, height: number) {
  const renderProviderDiv = document.createElement('div')
  renderProviderDiv.setAttribute('class', 'render-provider')
  Object.assign(renderProviderDiv.style, {
    width: '1440px',
    height: '900px',
  })

  const div = document.createElement('div')
  Object.assign(div.style, {
    width: `${width}px`,
    height: `${height}px`,
  })

  // we have to mock this for jsdom.
  div.getBoundingClientRect = () => ({
    width,
    height,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    x: width,
    y: height,
    toJSON() {
      const { toJSON, ...rect } = this
      return rect
    },
  })
  div.textContent = 'Welcome'
  div.setAttribute('data-extension-point', extensionPointName)

  renderProviderDiv.getBoundingClientRect = () => ({
    width,
    height,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
    x: width,
    y: height,
    toJSON() {
      const { toJSON, ...rect } = this
      return rect
    },
  })
  renderProviderDiv.appendChild(div)
  return renderProviderDiv
}

const mockBlocks: State['sidebarBlocksMap'] = {
  welcome: {
    isEditable: true,
    title: 'Welcome Banner',
  },
}

function setUpDom() {
  Object.defineProperty(HTMLElement.prototype, 'scrollWidth', {
    configurable: true,
    get: function getScrollWidth() {
      return this._scrollWidth || 0
    },
    set(val) {
      this._scrollWidth = val
    },
  })

  // eslint-disable-next-line
  // @ts-ignore
  document.body.scrollWidth = 1440
  document.body.appendChild(createMockDiv(300, 300))
}

function cleanUpDOM() {
  document.body.innerHTML = '<div></div>'
}

describe('HighlightOverlay', () => {
  beforeEach(() => {
    setUpDom()
  })
  afterEach(() => {
    cleanUpDOM()
  })

  it(`should edit extension-point when its element is clicked`, () => {
    const mockEditExtensionPoint = jest.fn()
    const mockHighlightHandler = jest.fn()
    const { getByText } = render(
      <HighlightOverlay
        editExtensionPoint={mockEditExtensionPoint}
        editMode
        highlightHandler={mockHighlightHandler}
        highlightTreePath={extensionPointName}
      />
    )
    const extensionPointDiv = getByText(/welcome/i)
    act(() => {
      window.__setHighlightTreePath({ sidebarBlocksMap: mockBlocks })
    })

    fireEvent.click(extensionPointDiv)

    expect(mockEditExtensionPoint).toBeCalledTimes(1)
    expect(mockEditExtensionPoint).toHaveBeenCalledWith(extensionPointName)
  })

  it(`should have highlight when an element is being edited`, () => {
    const mockEditExtensionPoint = jest.fn()
    const mockHighlightHandler = jest.fn()
    const { queryByTestId } = render(
      <HighlightOverlay
        editExtensionPoint={mockEditExtensionPoint}
        editMode
        highlightHandler={mockHighlightHandler}
        highlightTreePath={null}
      />
    )

    expect(queryByTestId('editor-provider-overlay')).toBeFalsy()

    act(() => {
      window.__setHighlightTreePath({
        openBlockTreePath: extensionPointName,
        sidebarBlocksMap: mockBlocks,
      })
    })

    expect(queryByTestId('editor-provider-overlay')).toBeTruthy()
  })

  it('should set tree path when corresponding element is hovered', () => {
    const mockEditExtensionPoint = jest.fn()
    const mockHighlightHandler = jest.fn()

    render(
      <HighlightOverlay
        editExtensionPoint={mockEditExtensionPoint}
        editMode
        highlightHandler={mockHighlightHandler}
        highlightTreePath={null}
      />
    )

    act(() => {
      window.__setHighlightTreePath({ sidebarBlocksMap: mockBlocks })
    })

    const extensionPointDiv = document.querySelector(
      '[data-extension-point="welcome"]'
    )

    if (extensionPointDiv) {
      fireEvent.mouseOver(extensionPointDiv)
    }

    expect(mockHighlightHandler).toHaveBeenCalledTimes(1)
    expect(mockHighlightHandler).toHaveBeenCalledWith('welcome')
  })

  it('should highlight element when it is set externally', () => {
    const mockEditExtensionPoint = jest.fn()
    const mockHighlightHandler = jest.fn()
    const { queryByTestId } = render(
      <HighlightOverlay
        editExtensionPoint={mockEditExtensionPoint}
        editMode
        highlightHandler={mockHighlightHandler}
        highlightTreePath={extensionPointName}
      />
    )

    expect(queryByTestId('editor-provider-overlay')).toBeFalsy()

    act(() => {
      window.__setHighlightTreePath({
        sidebarBlocksMap: mockBlocks,
      })
    })

    expect(queryByTestId('editor-provider-overlay')).toBeTruthy()
  })

  it(`should show extension point title when it's highlighted`, () => {
    const mockEditExtensionPoint = jest.fn()
    const mockHighlightHandler = jest.fn()
    const { queryByText } = render(
      <HighlightOverlay
        editExtensionPoint={mockEditExtensionPoint}
        editMode
        highlightHandler={mockHighlightHandler}
        highlightTreePath={extensionPointName}
      />
    )

    expect(queryByText(/welcome banner/i)).toBeFalsy()

    act(() => {
      window.__setHighlightTreePath({
        sidebarBlocksMap: mockBlocks,
      })
    })

    expect(queryByText(/welcome banner/i)).toBeTruthy()
  })
})
