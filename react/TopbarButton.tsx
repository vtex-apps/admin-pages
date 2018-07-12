import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { injectIntl, intlShape } from 'react-intl'
import { Button, IconEdit, IconCheck } from 'vtex.styleguide'

// eslint-disable-next-line
class TopbarButton extends Component {
  public static propTypes = {
    editor: PropTypes.object,
    intl: intlShape.isRequired
  }

  public render() {
    const {
      intl,
      editor: { toggleEditMode, editMode },
    } = this.props
    return (
      <Button
        onClick={toggleEditMode}
        variation={`${editMode ? 'secondary' : 'primary'}`}
        size="small"
      >
        {editMode ? (
          <IconCheck size={11} color="currentColor" />
        ) : (
          <IconEdit size={12} color="currentColor" solid />
        )}
        <span className="pl3 dn di-ns">
          {intl.formatMessage({ id: `pages.editor.components.${editMode ? 'done' : 'edit'}` })}
        </span>
      </Button>
    )
  }
}

export default injectIntl(TopbarButton)
