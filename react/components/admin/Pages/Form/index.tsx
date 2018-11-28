import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { MutationFn } from 'react-apollo'
import { withRuntimeContext } from 'render'

import Form from './Form'
import {
  getAddConditionalTemplateState,
  getChangeConditionsConditionalTemplateState,
  getChangeTemplateConditionalTemplateState,
  getLoginToggleState,
  getRemoveConditionalTemplateState,
} from './stateHandlers'

interface Props {
  initialData: Route
  onDelete: MutationFn
  onExit: () => void
  onSave: MutationFn
  runtime: RenderContext
}

interface State {
  data: Route
  isLoading: boolean
}

class FormContainer extends Component<Props, State> {
  public static contextTypes = {
    stopLoading: PropTypes.func.isRequired,
  }

  constructor(props: Props) {
    super(props)

    this.state = {
      data: props.initialData,
      isLoading: false,
    }
  }

  public componentDidMount() {
    this.context.stopLoading()
  }

  public render() {
    const { conditions, templates, onExit } = this.props
    const { data, isLoading } = this.state

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
        conditions={conditions}
        onAddConditionalTemplate={this.handleAddConditionalTemplate}
        onRemoveConditionalTemplate={this.handleRemoveConditionalTemplate}
        onChangeTemplateConditionalTemplate={
          this.handleChangeTemplateConditionalTemplate
        }
        onChangeConditionsConditionalTemplate={
          this.handleChangeConditionsConditionalTemplate
        }
      />
    )
  }

  private handleRemoveConditionalTemplate = (uniqueId: number) => {
    this.setState(getRemoveConditionalTemplateState(uniqueId))
  }

  private handleAddConditionalTemplate: React.MouseEventHandler = e => {
    this.setState(getAddConditionalTemplateState)
  }

  private handleChangeTemplateConditionalTemplate = (
    uniqueId: number,
    template: string,
  ) => {
    this.setState(getChangeTemplateConditionalTemplateState(uniqueId, template))
  }

  private handleChangeConditionsConditionalTemplate = (
    uniqueId: number,
    conditions: string[],
  ) => {
    this.setState(
      getChangeConditionsConditionalTemplateState(uniqueId, conditions),
    )
  }

  private getDetailChangeHandler = (detailName: string) => (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const newDetailValue = e.target.value

    this.setState(prevState => ({
      ...prevState,
      data: {
        ...prevState.data,
        [detailName]: newDetailValue,
      },
    }))
  }

  private handleDelete = () => {
    const { onDelete, onExit } = this.props
    const { data } = this.state

    this.setState({ isLoading: true }, async () => {
      try {
        await onDelete({
          variables: {
            id: data.id,
          },
        })

        onExit()
      } catch (err) {
        this.setState({ isLoading: false }, () => {
          console.log(err)

          alert('Error: route could not be deleted.')
        })
      }
    })
  }

  private handleLoginToggle = () => {
    this.setState(getLoginToggleState)
  }

  private handleSave = (event: React.FormEvent) => {
    const { onExit, onSave } = this.props

    event.preventDefault()

    this.setState({ isLoading: true }, async () => {
      try {
        await onSave({
          variables: {
            route: this.state.data,
          },
        })

        onExit()
      } catch (err) {
        this.setState({ isLoading: false }, () => {
          console.log(err)

          alert('Error: route could not be saved.')
        })
      }
    })
  }
}

export default withRuntimeContext(FormContainer)
