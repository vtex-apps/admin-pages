import { RouteFormData } from 'pages'
import { isEmpty } from 'ramda'
import * as React from 'react'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'

import { ToastConsumerFunctions } from 'vtex.styleguide'

import Form from './Form'
import { OperationsResults } from './Operations'
import { getValidateFormState } from './utils'

import { generateNewRouteId } from '../../pages/Form/utils'
import { isNewRoute } from '../../pages/utils'

import { formatStatements } from '../../../../utils/conditions'

interface ComponentProps {
  initialData: RouteFormData
  initialContent: {
    id: string
    text: string
  }
  onDelete: OperationsResults['deletePage']
  onExit: () => void
  onSave: OperationsResults['savePage']
  onSaveContent: OperationsResults['saveContent']
  showToast: ToastConsumerFunctions['showToast']
  hideToast: ToastConsumerFunctions['hideToast']
}

interface RouteContentFromData {
  pageContent?: string
  contentId: string
}

type Props = ComponentProps & InjectedIntlProps

export interface State {
  data: RouteFormData & RouteContentFromData
  isLoading: boolean
  formErrors: any
  isDeletable: boolean
  isInfoEditable: boolean
}

const messages = defineMessages({
  deleteError: {
    defaultMessage: 'Error: route could not be deleted.',
    id: 'admin/pages.admin.pages.form.delete.error',
  },
  deleteSuccess: {
    defaultMessage: 'Success',
    id: 'admin/pages.admin.pages.form.delete.success',
  },
  saveError: {
    defaultMessage: 'Error: route could not be saved.',
    id: 'admin/pages.admin.pages.form.save.error',
  },
  saveSuccess: {
    defaultMessage: 'Success',
    id: 'admin/pages.admin.pages.form.save.success',
  },
})

class FormContainer extends React.PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    const { declarer } = props.initialData || { declarer: null }
    const isNew = isNewRoute(props.initialData)

    this.state = {
      data: {
        ...props.initialData,
        contentId: props.initialContent.id,
        pageContent: props.initialContent.text,
      },
      formErrors: {},
      isDeletable: !isNew,
      isInfoEditable: !declarer || isNew,
      isLoading: false,
    }
  }

  public render() {
    const { onExit } = this.props
    const { data, isDeletable, isInfoEditable, isLoading, formErrors } = this.state

    return (
      <Form
        data={data}
        errors={formErrors}
        handleChangeFieldValue={this.handleChangeFieldValue}
        isDeletable={isDeletable}
        isInfoEditable={isInfoEditable}
        isLoading={isLoading}
        onSubmit={this.handleSave}
        onDelete={this.handleDelete}
        onExit={onExit}
      />
    )
  }

  private handleChangeFieldValue = (field: string, value: string | number | null) => {
    return this.setState(prevState => ({
      ...prevState,
      data: {
        ...prevState.data,
        [field]: value,
      },
      formErrors: {},
    }))
  }

  private handleSave = (event: React.FormEvent) => {
    const { intl, onExit, onSave, showToast, onSaveContent } = this.props

    event.preventDefault()

    const nextState = getValidateFormState(this.state)
    if (isEmpty(nextState.formErrors)) {
      const {
        auth,
        blockId,
        contentId,
        context,
        declarer,
        domain,
        interfaceId,
        metaTagDescription,
        metaTagKeywords,
        pageContent,
        pages,
        path,
        routeId: routeIdCandidate,
        title,
        uuid,
      } = this.state.data
      const routeId = routeIdCandidate || generateNewRouteId(interfaceId, path)

      this.setState({ isLoading: true }, async () => {
        try {
          await onSave({
            variables: {
              route: {
                auth,
                blockId,
                context,
                declarer,
                domain,
                interfaceId,
                metaTags: {
                  description: metaTagDescription,
                  keywords: (metaTagKeywords || []).map(({ value }) => value),
                },
                pages: pages.map(page => {
                  return {
                    condition: {
                      allMatches: page.condition.allMatches,
                      id: page.condition.id || undefined,
                      statements: formatStatements(page.condition.statements),
                    },
                    pageId: page.pageId || undefined,
                    template: page.template,
                  }
                }),
                path,
                routeId,
                title,
                uuid,
              },
            },
          })

          await onSaveContent({
            variables: {
              blockId,
              configuration: {
                condition: {
                  allMatches: true,
                  id: 'vtex.rich-text@0.x:rich-text',
                  pageContext: {
                    id: '*',
                    type: '*',
                  },
                  statements: [],
                },
                contentId,
                contentJSON: JSON.stringify({ text: pageContent }),
                label: null,
                origin: 'vtex.rich-text@0.x:rich-text',
              },
              lang: 'pt-BR',
              template: 'vtex.store@2.x:store.institutional',
              treePath: `${routeId}/rich-text`,
            },
          })

          showToast({
            horizontalPosition: 'right',
            message: intl.formatMessage(messages.saveSuccess),
          })

          onExit()
        } catch (err) {
          this.setState({ isLoading: false }, () => {
            console.error(err)

            showToast({
              horizontalPosition: 'right',
              message: intl.formatMessage(messages.saveError),
            })
          })
        }
      })
    } else {
      this.setState(getValidateFormState)
    }
  }

  private handleDelete = () => {
    const { showToast, intl, onDelete, onExit } = this.props
    const { data } = this.state

    this.setState({ isLoading: true }, async () => {
      try {
        if (!data.uuid) {
          throw new Error('No uuid')
        }

        await onDelete({
          variables: {
            uuid: data.uuid,
          },
        })

        showToast({
          horizontalPosition: 'right',
          message: intl.formatMessage(messages.deleteSuccess),
        })

        onExit()
      } catch (err) {
        this.setState({ isLoading: false }, () => {
          console.log(err)

          showToast({
            horizontalPosition: 'right',
            message: intl.formatMessage(messages.deleteError),
          })
        })
      }
    })
  }
}

export default injectIntl(FormContainer)