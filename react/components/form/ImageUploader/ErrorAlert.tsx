import React, { useState } from 'react'
import { Alert } from 'vtex.styleguide'

interface Props {
  message: string
}

const ErrorAlert: React.FunctionComponent<Props> = ({ message }) => {
  const [isVisible, setIsVisible] = useState<boolean>(true)

  return isVisible ? (
    <div className="w-100 mt3">
      <Alert onClose={() => setIsVisible(false)} type="error">
        {message}
      </Alert>
    </div>
  ) : null
}

export default ErrorAlert
