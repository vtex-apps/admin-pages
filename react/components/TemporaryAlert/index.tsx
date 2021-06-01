import React from 'react'
import {
  Alert,
  ThemeProvider,
  createSystem,
  Box,
  Button,
  Flex,
  IconNotifications,
} from '@vtex/admin-ui'
import { useIntl } from 'react-intl'
import { useRuntime } from 'vtex.render-runtime'

const system = createSystem('admin-pages')

export function TemporaryAlert() {
  const { workspace } = useRuntime()
  const { formatMessage } = useIntl()

  if (workspace !== 'newadmin') {
    return null
  }

  const handleOnClick = () => {
    window.top.location.href = window.top.location.href.replace(
      `${workspace}--`,
      ''
    )
  }

  return (
    <ThemeProvider system={system}>
      <Box
        csx={{
          padding: 4,
        }}
      >
        <Alert visible fluid>
          <Flex>
            <Flex align="center">
              <IconNotifications
                csx={{
                  color: 'blue',
                }}
              />
            </Flex>
            <Flex
              align="center"
              csx={{
                marginX: 2,
              }}
            >
              {formatMessage({ id: 'admin/pages.editor.newadmin.alert' })}
            </Flex>
            <Button onClick={handleOnClick}>
              {formatMessage({
                id: 'admin/pages.editor.newadmin.alert.button',
              })}
            </Button>
          </Flex>
        </Alert>
      </Box>
    </ThemeProvider>
  )
}
