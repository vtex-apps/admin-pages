import PropTypes from 'prop-types'
import { isEmpty } from 'ramda'
import React, { Component } from 'react'
import { compose, MutationFn } from 'react-apollo'
import { InjectedIntlProps, injectIntl } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import {
  ConditionsProps,
  ConditionsStatement,
  ToastConsumerFunctions,
} from 'vtex.styleguide'

import { RouteFormData } from 'pages'

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
import { DateVerbOptions, SaveRouteVariables } from './typings'

interface ComponentProps {
  initialData: RouteFormData
  onDelete: MutationFn
  onExit: () => void
  onSave: MutationFn<any, SaveRouteVariables>
  runtime: RenderContext
  templates: Template[]
  showToast: ToastConsumerFunctions['showToast']
  hideToast: ToastConsumerFunctions['hideToast']
}

type Props = ComponentProps & InjectedIntlProps

export interface State {
  data: RouteFormData
  isLoading: boolean
  formErrors: Partial<{ [key in keyof Route]: string }>
}

class FormContainer extends Component<Props, State> {
  public static contextTypes = {
    stopLoading: PropTypes.func.isRequired,
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      data: props.initialData,
      formErrors: {},
      isLoading: false,
    }
  }

  public componentDidMount() {
    this.context.stopLoading()
  }

  public render() {
    const { templates, onExit } = this.props
    const { data, formErrors, isLoading } = this.state

    return (
      <Form
        data={data}
        detailChangeHandlerGetter={this.getDetailChangeHandler}
        isLoading={isLoading}
        onDelete={this.handleDelete}
        onExit={onExit}
        onLoginToggle={this.handleLoginToggle}
        onSave={this.handleSave}
        templates={templates}
        onAddConditionalTemplate={this.handleAddConditionalTemplate}
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

  private getDetailChangeHandler = (detailName: string) => (
    e: React.ChangeEvent<HTMLInputElement>
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
        await onDelete({
          variables: {
            uuid: data.uuid,
          },
        })

        showToast({
          horizontalPosition: 'right',
          message: intl.formatMessage({
            id: 'pages.admin.pages.form.delete.success',
          }),
        })

        onExit()
      } catch (err) {
        this.setState({ isLoading: false }, () => {
          console.log(err)

          showToast({
            horizontalPosition: 'right',
            message: intl.formatMessage({
              id: 'pages.admin.pages.form.delete.error',
            }),
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
        pages,
        path,
        routeId,
        title,
        uuid,
      } = this.state.data

      const getObjectJson = (
        dateInfo: { date: Date; to: Date; from: Date },
        verb: DateVerbOptions
      ) => {
        return JSON.stringify(
          {
            between: {
              from: dateInfo.from,
              to: dateInfo.to,
            },
            from: {
              from: dateInfo.date,
            },
            is: {
              from: dateInfo.date,
            },
            to: {
              to: dateInfo.date,
            },
          }[verb]
        )
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
                pages: pages.map(page => {
                  return {
                    condition: {
                      allMatches: page.condition.allMatches,
                      id: page.condition.id || undefined,
                      statements: page.condition.statements.map(
                        ({ object, subject, verb }) => ({
                          objectJSON: getObjectJson(
                            object,
                            verb as DateVerbOptions
                          ),
                          subject,
                          verb,
                        })
                      ),
                    },
                    pageId: page.pageId || undefined,
                    template: page.template,
                  }
                }),
                path,
                routeId: routeId || `${interfaceId}#${path.replace('/', '')}`,
                title,
                uuid,
              },
            },
          })

          showToast({
            horizontalPosition: 'right',
            message: intl.formatMessage({
              id: 'pages.admin.pages.form.save.success',
            }),
          })

          onExit()
        } catch (err) {
          this.setState({ isLoading: false }, () => {
            console.error(err)

            showToast({
              horizontalPosition: 'right',
              message: intl.formatMessage({
                id: 'pages.admin.pages.form.save.error',
              }),
            })
          })
        }
      })
    } else {
      this.setState(getValidateFormState)
    }
  }
}

export default compose(
  withRuntimeContext,
  injectIntl
)(FormContainer)
