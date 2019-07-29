import { diff } from 'deep-object-diff'
import { RouteFormData } from 'pages'
import PropTypes from 'prop-types'
import { isEmpty } from 'ramda'
import React, { Component } from 'react'
import { defineMessages, InjectedIntlProps, injectIntl } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import {
  ConditionsProps,
  ConditionsStatement,
  ToastConsumerFunctions,
} from 'vtex.styleguide'

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
}

type Props = ComponentProps & InjectedIntlProps

export interface State {
  data: RouteFormData
  isDeletable: boolean
  isLoading: boolean
  isInfoEditable: boolean
  formErrors: FormErrors
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
  public static contextTypes = {
    stopLoading: PropTypes.func.isRequired,
  }

  constructor(props: Props) {
    super(props)

    const { declarer } = props.initialData || { declarer: null }

    const isNew = isNewRoute(props.initialData)

    const isDeletable = !declarer && !isNew
    const isInfoEditable = !declarer || isNew

    this.state = {
      data: props.initialData,
      formErrors: {},
      isDeletable,
      isInfoEditable,
      isLoading: false,
    }
  }

  public componentDidMount() {
    this.context.stopLoading()
  }

  public render() {
    const { isCustomPage, templates, onExit } = this.props
    const {
      data,
      formErrors,
      isDeletable,
      isInfoEditable,
      isLoading,
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
        onAddConditionalTemplate={this.handleAddConditionalTemplate}
        onChangeKeywords={this.handleMetaTagKeywords}
        onRemoveConditionalTemplate={this.handleRemoveConditionalTemplate}
        onChangeTemplateConditionalTemplate={
          this.handleChangeTemplateConditionalTemplate
        }
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
    values: Array<{ label: string; value: string }>
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

    this.setState(prevState => ({
      ...prevState,
      data: {
        ...prevState.data,
        [detailName]: newDetailValue,
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
          console.log(err)

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
      } = isUserRoute(this.props.initialData)
        ? this.state.data
        : {
            ...(diff(this.props.initialData, this.state.data) as Partial<
              RouteFormData
            >),
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
