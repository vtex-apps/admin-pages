import { RouteFormData } from 'pages'
import { isEmpty } from 'ramda'
import * as React from 'react'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'

import { ToastConsumerFunctions } from 'vtex.styleguide'

import Form from './Form'
import { OperationsResults } from './Operations'

import { generateNewRouteId } from '../../pages/Form/utils'

import { formatStatements } from '../../../../utils/conditions'

interface ComponentProps {
  // isCustomPage: boolean
  initialData: RouteFormData
  onDelete: () => {}
  onExit: () => void
  onSave: OperationsResults['savePage']
  // runtime: RenderContext
  // templates: Template[]
  showToast: ToastConsumerFunctions['showToast']
  hideToast: ToastConsumerFunctions['hideToast']
}

type Props = ComponentProps & InjectedIntlProps

interface State {
  data: RouteFormData
  isLoading: boolean
  formErrors: any
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

    // const { declarer } = props.initialData || { declarer: null }

    // const isNew = isNewRoute(props.initialData)

    // const isDeletable = !declarer && !isNew
    // const isInfoEditable = !declarer || isNew

    this.state = {
      data: props.initialData,
      formErrors: {},
      isLoading: false,
    }
  }

  public render() {
    const { data, isLoading } = this.state

    return (
      <Form
        data={data}
        handleChangeFieldValue={this.handleChangeFieldValue}
        isLoading={isLoading}
        onSubmit={this.handleSave}
      />
    )
  }

  private handleChangeFieldValue = (field: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newDetailValue = e.target.value

    this.setState(prevState => ({
      ...prevState,
      data: {
        ...prevState.data,
        [field]: newDetailValue,
      },
      formErrors: {},
    }))
  }

  private handleSave = (event: React.FormEvent) => {
    const { intl, onExit, onSave, showToast } = this.props

    event.preventDefault()

    // const nextState = getValidateFormState(this.state)
    const nextState = this.state
    if (isEmpty(nextState.formErrors)) {
      const {
        auth,
        blockId,
        context,
        declarer,
        domain,
        interfaceId,
        metaTagDescription,
        metaTagKeywords,
        pages,
        path,
        routeId,
        title,
        uuid,
      } = this.state.data

      const variables = {
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
          routeId: routeId || generateNewRouteId(interfaceId, path),
          title,
          uuid,
        },
      }

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
                routeId: routeId || generateNewRouteId(interfaceId, path),
                title,
                uuid,
              },
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
      // this.setState(getValidateFormState)
    }
  }
}

export default injectIntl(FormContainer)