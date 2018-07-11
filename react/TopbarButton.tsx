import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { FormattedMessage } from 'react-intl'
import { Button, IconEdit, IconCheck } from 'vtex.styleguide'

// eslint-disable-next-line
class TopbarButton extends Component {
  public static propTypes = {
    editor: PropTypes.object,
  }

  public render() {
    const { editor: { toggleEditMode, editMode} } = this.props
    return (
      <Button
          onClick={toggleEditMode}
          variation={`${editMode ? 'secondary' : 'primary'}`} size="small"
        >
          {editMode ? <IconCheck color="currentColor" /> : <IconEdit color="currentColor" />}
          <span className="pl3">
            <FormattedMessage id={`pages.editor.components.${editMode ? 'done' : 'select'}`}/>
          </span>
        </Button>
    )
  }
}

export default TopbarButton
