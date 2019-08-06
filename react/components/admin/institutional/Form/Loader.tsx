import * as React from 'react'
import { Spinner } from 'vtex.styleguide'

const Loader = () => (
  <div className="vh-100 flex items-center justify-center">
    <Spinner />
  </div>
)

export default Loader
