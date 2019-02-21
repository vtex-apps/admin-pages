import { mapObjIndexed, values } from 'ramda'
import React from 'react'
import { injectIntl } from 'react-intl'
import { withRuntimeContext } from 'vtex.render-runtime'
import { PageHeader, Tab, Tabs } from 'vtex.styleguide'

const fields = {
  pages: {
    path: 'pages',
    titleId: 'pages.admin.tabs.pages',
  },
  redirects: {
    path: 'redirects',
    titleId: 'pages.admin.tabs.redirects',
  },
  settings: {
    path: 'settings',
    titleId: 'pages.admin.tabs.settings',
  },
}

interface FieldInfo {
  path: string
  titleId: string
}

interface CustomProps {
  targetPath: string
}

type Props = CustomProps & ReactIntl.InjectedIntlProps & RenderContextProps

const AdminWrapper: React.SFC<Props> = ({
  children,
  intl,
  targetPath,
  runtime,
}) => (
  <div className="h-100 overflow-y-auto bg-light-silver">
    <div className="center mw8">
      <PageHeader title="CMS" />
      <div className="ph7">
        <Tabs>
          {values(
            mapObjIndexed(
              (info: FieldInfo, key: string) => (
                <Tab
                  active={
                    targetPath.startsWith(info.path) &&
                    (targetPath === '' ? targetPath === info.path : true)
                  }
                  key={key}
                  label={intl.formatMessage({ id: info.titleId })}
                  onClick={() => {
                    runtime.navigate({ to: '/admin/cms/' + info.path })
                  }}
                />
              ),
              fields
            )
          )}
        </Tabs>
      </div>
      <div className="ma7">{children}</div>
    </div>
  </div>
)

export default withRuntimeContext(injectIntl(AdminWrapper))
