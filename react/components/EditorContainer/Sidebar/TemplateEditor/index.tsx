import React, { Component } from 'react'
import { compose, graphql, MutationFn } from 'react-apollo'
import { injectIntl } from 'react-intl'
import { IChangeEvent } from 'react-jsonschema-form'

import UpdateBlock from '../../../../queries/UpdateBlock.graphql'
import { getBlockPath, getRelativeBlocksIds } from '../../../../utils/blocks'
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
  private block: Extension

  constructor(props: Props) {
    super(props)

    const { editor, iframeRuntime } = this.props

    this.block = getExtension(editor.editTreePath, iframeRuntime.extensions)

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
    this.props.editor.editExtensionPoint(null)
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

    updateExtensionFromForm(editTreePath, event, intl, iframeRuntime)
  }

  private handleDiscard = () => {
    const { editor, iframeRuntime, modal } = this.props

    this.props.formMeta.setWasModified(false, () => {
      if (!modal.closeCallbackHandler) {
        modal.setHandlers({
          closeCallbackHandler: this.exit,
        })
      }

      iframeRuntime.updateExtension(editor.editTreePath as string, this.block)

      modal.close()
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

  private handleSave = async () => {
    const { editor, formMeta, iframeRuntime, modal, updateBlock } = this.props

    const extensionProps = this.getExtensionProps()

    const parsedRelativeBlocks = getRelativeBlocksIds(
      editor.editTreePath!,
      iframeRuntime.extensions,
      {
        after: this.block.after,
        around: this.block.around,
        before: this.block.before,
      }
    )

    formMeta.toggleLoading()

    try {
      await updateBlock({
        variables: {
          block: {
            after: parsedRelativeBlocks.after,
            around: parsedRelativeBlocks.around,
            before: parsedRelativeBlocks.before,
            blocks: this.block.blocks,
            propsJSON: JSON.stringify(extensionProps),
          },
          blockPath: getBlockPath(
            iframeRuntime.extensions,
            editor.editTreePath!
          ),
        },
      })

      formMeta.setWasModified(false, () => {
        formMeta.toggleLoading(this.exit)
      })
    } catch (err) {
      console.log(err)

      formMeta.toggleLoading()
    } finally {
      if (modal.isOpen) {
        modal.close()
      }
    }
  }
}

export default compose(
  injectIntl,
  graphql(UpdateBlock, {
    name: 'updateBlock',
  })
)(TemplateEditor)
