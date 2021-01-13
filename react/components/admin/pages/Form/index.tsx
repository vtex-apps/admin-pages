import { diff } from 'deep-object-diff'
import { RouteFormData } from 'pages'
import { isEmpty } from 'ramda'
import React, { Component } from 'react'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import {
  ConditionsProps,
  ConditionsStatement,
  ToastConsumerFunctions,
} from 'vtex.styleguide'
import { Binding } from 'vtex.tenant-graphql'

import { formatStatements } from '../../../../utils/conditions'
import { isNewRoute, isUserRoute } from '../utils'
import { generateNewRouteId } from './utils'
import Form from './Form'
import {
  getAddConditionalTemplateState,
  getChangeOperatorConditionalTemplateState,
  getChangeStatementsConditionalTemplate,
  getChangeTemplateConditionalTemplateState,
  getLoginToggleState,
  getRemoveConditionalTemplateState,
  getValidateFormState,
} from './stateHandlers'
import { FormErrors } from './typings'
import { OperationsResults } from './Operations'
import { slugify } from '../../utils'
import { DropdownChangeInput } from '../../../../utils/bindings/typings'

interface ComponentProps {
  isCustomPage: boolean
  initialData: RouteFormData
  onDelete: OperationsResults['deleteRoute']
  onExit: () => void
  onSave: OperationsResults['saveRoute']
  runtime: RenderContext
  templates: Template[]
  showToast: ToastConsumerFunctions['showToast']
  hideToast: ToastConsumerFunctions['hideToast']
  storeBindings: Binding[]
}

type Props = ComponentProps & InjectedIntlProps

export interface State {
  data: RouteFormData
  isDeletable: boolean
  isLoading: boolean
  isInfoEditable: boolean
  formErrors: FormErrors
  storeBindings: Binding[]
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

class FormContainer extends Component<Props, State> {
  private isNew: boolean

  public constructor(props: Props) {
    super(props)

    const { declarer } = props.initialData || { declarer: null }

    this.isNew = isNewRoute(props.initialData)
    this.state = {
      data: props.initialData,
      formErrors: {},
      isDeletable: !declarer && !this.isNew,
      isInfoEditable: !declarer || this.isNew,
      isLoading: false,
      storeBindings: props.storeBindings,
    }
  }

  public componentDidMount() {
    window.top.postMessage({ action: { type: 'STOP_LOADING' } }, '*')
  }

  public render() {
    const { isCustomPage, templates, onExit } = this.props
    const {
      data,
      formErrors,
      isDeletable,
      isInfoEditable,
      isLoading,
      storeBindings,
    } = this.state

    return (
      <Form
        isCustomPage={isCustomPage}
        data={data}
        detailChangeHandlerGetter={this.getDetailChangeHandler}
        isDeletable={isDeletable}
        isLoading={isLoading}
        isInfoEditable={isInfoEditable}
        onDelete={this.handleDelete}
        onExit={onExit}
        onLoginToggle={this.handleLoginToggle}
        onSave={this.handleSave}
        templates={templates}
        storeBindings={storeBindings}
        onAddConditionalTemplate={this.handleAddConditionalTemplate}
        onChangeKeywords={this.handleMetaTagKeywords}
        onRemoveConditionalTemplate={this.handleRemoveConditionalTemplate}
        onChangeTemplateConditionalTemplate={
          this.handleChangeTemplateConditionalTemplate
        }
        onChangeBinding={this.handleBindingChange}
        onChangeOperatorConditionalTemplate={
          this.handleChangeOperatorConditionalTemplate
        }
        onChangeStatementsConditionalTemplate={
          this.handleChangeStatementsConditionalTemplate
        }
        formErrors={formErrors}
      />
    )
  }

  private handleRemoveConditionalTemplate = (uniqueId: number) => {
    this.setState(getRemoveConditionalTemplateState(uniqueId))
  }

  private handleAddConditionalTemplate = () => {
    this.setState(getAddConditionalTemplateState)
  }

  private handleBindingChange = ({
    target: { value },
  }: DropdownChangeInput) => {
    const { storeBindings, data } = this.state
    const selectedBinding = storeBindings.find(binding => binding.id === value)
    if (!selectedBinding) {
      throw new Error(
        "Selected binding does not exist or isn't a store binding"
      )
    }
    data.binding = selectedBinding.id
    this.setState({ data })
  }

  private handleChangeTemplateConditionalTemplate = (
    uniqueId: number,
    template: string
  ) => {
    this.setState(getChangeTemplateConditionalTemplateState(uniqueId, template))
  }

  private handleChangeOperatorConditionalTemplate = (
    uniqueId: number,
    operator: NonNullable<ConditionsProps['operator']>
  ) => {
    this.setState(getChangeOperatorConditionalTemplateState(uniqueId, operator))
  }

  private handleChangeStatementsConditionalTemplate = (
    uniqueId: number,
    statements: ConditionsStatement[]
  ) => {
    this.setState(getChangeStatementsConditionalTemplate(uniqueId, statements))
  }

  private handleMetaTagKeywords = (
    values: { label: string; value: string }[]
  ) => {
    this.setState(prevState => ({
      ...prevState,
      data: {
        ...prevState.data,
        metaTagKeywords: values,
      },
      formErrors: {},
    }))
  }

  private getDetailChangeHandler = (detailName: string) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const newDetailValue = e.target.value
    const newDataPayload = {
      [detailName]: newDetailValue,
      ...(detailName === 'title' &&
        this.isNew && { path: `/${slugify(newDetailValue)}` }),
    }

    this.setState(prevState => ({
      ...prevState,
      data: {
        ...prevState.data,
        ...newDataPayload,
      },
      formErrors: {},
    }))
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
          console.error(err)

          showToast({
            horizontalPosition: 'right',
            message: intl.formatMessage(messages.deleteError),
          })
        })
      }
    })
  }

  private handleLoginToggle = () => {
    this.setState(getLoginToggleState)
  }

  private handleSave = (event: React.FormEvent) => {
    const { intl, onExit, onSave, showToast } = this.props

    event.preventDefault()

    const nextState = getValidateFormState(this.state)
    if (isEmpty(nextState.formErrors)) {
      const {
        auth,
        binding: bindingId,
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
        dataSource,
      } = isUserRoute(this.props.initialData)
        ? this.state.data
        : {
            ...(diff(this.props.initialData, this.state.data) as Partial<
              RouteFormData
            >),
            pages: this.state.data.pages || this.state.data,
            declarer: this.state.data.declarer,
            domain: this.state.data.domain,
            path: this.state.data.path,
            routeId: this.state.data.routeId,
            uuid: this.state.data.uuid,
          }

      this.setState({ isLoading: true }, async () => {
        try {
          await onSave({
            variables: {
              route: {
                auth,
                bindingId,
                blockId,
                context,
                declarer,
                domain,
                interfaceId,
                metaTags:
                  metaTagDescription || metaTagKeywords
                    ? {
                        description: metaTagDescription,
                        keywords: (metaTagKeywords || []).map(
                          ({ value }) => value
                        ),
                      }
                    : undefined,
                pages:
                  pages &&
                  pages.map(page => {
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
                routeId:
                  routeId ||
                  generateNewRouteId(
                    interfaceId || this.state.data.interfaceId,
                    path
                  ),
                title,
                uuid,
                dataSource,
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
      this.setState(getValidateFormState)
    }
  }
}

export default withRuntimeContext(injectIntl(FormContainer))
