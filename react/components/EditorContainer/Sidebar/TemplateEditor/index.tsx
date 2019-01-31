import React, { Component } from 'react'
import { compose, graphql } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { IChangeEvent } from 'react-jsonschema-form'

import AvailableComponents from '../../../../queries/AvailableComponents.graphql'
import {
  getExtension,
  updateExtensionFromForm
} from '../../../../utils/components'
import ComponentEditor from '../ComponentEditor'
import { FormMetaContext, ModalContext } from '../typings'

interface Props extends ReactIntl.InjectedIntlProps {
  availableComponents: {
    availableComponents: object[];
    error: object;
    loading: boolean;
  }
  editor: EditorContext
  formMeta: FormMetaContext
  iframeRuntime: RenderContext
  modal: ModalContext
}

class TemplateEditor extends Component<Props> {
  private initialFormData: Extension

  constructor(props: Props) {
    super(props)

    const { editor, iframeRuntime } = this.props

    const extension = getExtension(
      editor.editTreePath,
      iframeRuntime.extensions
    )

    this.initialFormData = {
      component: extension.component || null,
      props: extension.props
    }

    props.modal.setHandlers({
      actionHandler: this.handleSave,
      cancelHandler: this.handleDiscard
    })
  }

  public render() {
    const { editor, formMeta, iframeRuntime, modal } = this.props

    const extension = getExtension(
      editor.editTreePath,
      iframeRuntime.extensions
    )

    const extensionProps = {
      component: extension.component || null,
      ...extension.props
    }

    return (
      <ComponentEditor
        editor={editor}
        iframeRuntime={iframeRuntime}
        isLoading={formMeta.isLoading && !modal.isOpen}
        onChange={this.handleChange}
        onClose={this.handleExit}
        onSave={this.handleSave}
        props={extensionProps}
        shouldRenderSaveButton={formMeta.wasModified}
      />
    )
  }

  private exit = () => {
    const { editor, iframeRuntime } = this.props

    iframeRuntime.updateExtension(
      editor.editTreePath as string,
      this.initialFormData
    )

    editor.editExtensionPoint(null)
  }

  private handleChange = (event: IChangeEvent) => {
    const {
      availableComponents: { availableComponents },
      editor: { editTreePath },
      formMeta,
      intl,
      iframeRuntime
    } = this.props

    if (!formMeta.wasModified) {
      formMeta.setWasModified(true)
    }

    updateExtensionFromForm(
      availableComponents,
      editTreePath,
      event,
      intl,
      iframeRuntime
    )
  }

  private handleDiscard = () => {
    this.props.formMeta.setWasModified(false, () => {
      this.handleModalResolution()
    })
  }

  private handleExit = () => {
    const { formMeta, modal } = this.props

    if (formMeta.wasModified) {
      modal.open()
    } else {
      this.exit()
    }
  }

  private handleModalResolution = () => {
    const { modal } = this.props

    if (!modal.closeCallbackHandler) {
      modal.setHandlers({
        closeCallbackHandler: this.exit
      })
    }

    modal.close()
  }

  private handleSave = () => {
    console.log('Template editor: SAVE')
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
        renderMajor: 7
      }
    })
  })
)(TemplateEditor)
