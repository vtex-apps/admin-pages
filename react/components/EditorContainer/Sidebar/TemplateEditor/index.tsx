import React, { Component } from 'react'
import { compose, graphql, MutationFn } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { IChangeEvent } from 'react-jsonschema-form'

import UpdateBlock from '../../../../queries/UpdateBlock.graphql'
import { getBlockPath } from '../../../../utils/blocks'
import {
  getExtension,
  updateExtensionFromForm,
} from '../../../../utils/components'
import ComponentEditor from '../ComponentEditor'
import { FormMetaContext, ModalContext } from '../typings'

interface Props extends ReactIntl.InjectedIntlProps {
  editor: EditorContext
  formMeta: FormMetaContext
  iframeRuntime: RenderContext
  modal: ModalContext
  updateBlock: MutationFn
}

class TemplateEditor extends Component<Props> {
  private blocks: Extension['blocks']
  private initialFormData: Extension

  constructor(props: Props) {
    super(props)

    const { editor, iframeRuntime } = this.props

    const extension = getExtension(
      editor.editTreePath,
      iframeRuntime.extensions
    )

    this.blocks = extension.blocks

    this.initialFormData = {
      component: extension.component || null,
      props: extension.props,
    }

    props.modal.setHandlers({
      actionHandler: this.handleSave,
      cancelHandler: this.handleDiscard,
    })
  }

  public render() {
    const { editor, formMeta, iframeRuntime, modal } = this.props

    return (
      <ComponentEditor
        editor={editor}
        iframeRuntime={iframeRuntime}
        isLoading={formMeta.isLoading && !modal.isOpen}
        onChange={this.handleChange}
        onClose={this.handleExit}
        onSave={this.handleSave}
        props={this.getExtensionProps()}
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

  private getExtensionProps() {
    const { editor, iframeRuntime } = this.props

    const extension = getExtension(
      editor.editTreePath,
      iframeRuntime.extensions
    )

    return {
      component: extension.component || null,
      ...extension.props,
    }
  }

  private handleChange = (event: IChangeEvent) => {
    const {
      editor: { editTreePath },
      formMeta,
      intl,
      iframeRuntime,
    } = this.props

    if (!formMeta.wasModified) {
      formMeta.setWasModified(true)
    }

    updateExtensionFromForm(
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
        closeCallbackHandler: this.exit,
      })
    }

    modal.close()
  }

  private handleSave = async () => {
    const { editor, formMeta, iframeRuntime, updateBlock } = this.props

    const extensionProps = this.getExtensionProps()

    formMeta.toggleLoading()

    try {
      await updateBlock({
        variables: {
          blockPath: getBlockPath(
            iframeRuntime.extensions,
            editor.editTreePath!
          ),
          changes: {
            children: this.blocks,
            propsJSON: JSON.stringify(extensionProps),
          },
        },
      })
    } catch (err) {
      console.log(err)
    } finally {
      formMeta.setWasModified(false, () => {
        formMeta.toggleLoading(this.exit)
      })
    }
  }
}

export default compose(
  injectIntl,
  graphql(UpdateBlock, {
    name: 'updateBlock',
  })
)(TemplateEditor)
