import React from 'react'
import { PageHeader } from 'vtex.styleguide'

interface Props {
  title: string
}

const AdminStructure: React.FC<Props> = ({ children, title }) => (
  <div className="h-100 min-vh-100 overflow-y-auto bg-light-silver">
    <div className="center mw8">
      <PageHeader title={title} />

      {children}
    </div>
  </div>
)

export default AdminStructure
