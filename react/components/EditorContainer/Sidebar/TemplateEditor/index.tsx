import React, { Component, Fragment } from 'react'
import { compose, graphql } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { IChangeEvent } from 'react-jsonschema-form'

import AvailableComponents from '../../../../queries/AvailableComponents.graphql'
import {
  getExtension,
  updateExtensionFromForm,
} from '../../../../utils/components'
import Modal from '../../../Modal'

import ComponentEditor from '../ComponentEditor'

interface CustomProps {
  availableComponents: {
    availableComponents: object[]
    error: object
    loading: boolean
  }
  editor: EditorContext
  runtime: RenderContext
}

type Props = CustomProps & ReactIntl.InjectedIntlProps

interface State {
  isLoading: boolean
  shouldShowModal: boolean
  wasModified: boolean
}

class TemplateEditor extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      isLoading: false,
      shouldShowModal: false,
      wasModified: false,
    }
  }
  public render() {
    const { editor, intl, runtime } = this.props

    const extension = getExtension(editor.editTreePath, runtime.extensions)

    const extensionProps = {
      component: extension.component || null,
      ...extension.props,
    }

    return (
      <Fragment>
        <Modal
          isActionLoading={this.state.isLoading}
          isOpen={this.state.shouldShowModal}
          onClickAction={this.saveTemplate}
          onClickCancel={this.exit}
          onClose={this.toggleModalVisibility}
          textButtonAction={intl.formatMessage({
            id: 'pages.editor.components.button.save',
          })}
          textButtonCancel={intl.formatMessage({
            id: 'pages.editor.components.modal.button.discard',
          })}
          textMessage={intl.formatMessage({
            id: 'pages.editor.components.modal.text',
          })}
        />
        <ComponentEditor
          editor={editor}
          isLoading={this.state.isLoading}
          onChange={this.handleChange}
          onClose={this.handleExit}
          onSave={this.saveTemplate}
          props={extensionProps}
          runtime={runtime}
          shouldRenderSaveButton={this.state.wasModified}
        />
      </Fragment>
    )
  }

  private exit = () => {
    const { editor, runtime } = this.props

    runtime.updateRuntime()

    editor.editExtensionPoint(null)
  }

  private handleChange = (event: IChangeEvent) => {
    const {
      availableComponents: { availableComponents },
      editor: { editTreePath },
      intl,
      runtime,
    } = this.props

    if (!this.state.wasModified) {
      this.setState({ wasModified: true })
    }

    updateExtensionFromForm(
      availableComponents,
      editTreePath,
      event,
      intl,
      runtime,
    )
  }

  private handleExit = () => {
    if (this.state.wasModified) {
      this.toggleModalVisibility()
    } else {
      this.exit()
    }
  }

  private saveTemplate = () => {
    console.log('Template editor: SAVE')
  }

  private toggleModalVisibility = () => {
    this.setState(prevState => ({
      ...prevState,
      shouldShowModal: !prevState.shouldShowModal,
    }))
  }
}

export default compose(
  injectIntl,
  graphql(AvailableComponents, {
    name: 'availableComponents',
    options: (props: Props) => ({
      variables: {
        extensionName: props.editor.editTreePath,
        production: false,
        renderMajor: 7,
      },
    }),
  }),
)(TemplateEditor)
