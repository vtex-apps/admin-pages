import React, { useCallback, useEffect, useState } from 'react'
import { Query, QueryResult, withApollo, WithApolloClient } from 'react-apollo'
import { defineMessages, useIntl } from 'react-intl'
import streamSaver from 'streamsaver'
import { TextEncoder } from 'text-encoding'
import { Helmet } from 'vtex.render-runtime'
import { Alert, Box, Pagination, ToastConsumer } from 'vtex.styleguide'
import * as WebStreamsPolyfill from 'web-streams-polyfill/ponyfill'

import {
  getCSVHeader,
  getCSVTemplate,
  PAGINATION_START,
  PAGINATION_STEP,
  WRAPPER_PATH,
  REDIRECTS_LIMIT,
} from './components/admin/redirects/consts'
import ImportErrorModal from './components/admin/redirects/ImportErrorModal'
import List from './components/admin/redirects/List'
import UploadModal from './components/admin/redirects/UploadModal'
import { AlertState } from './components/admin/redirects/typings'
import {
  TargetPathContextProps,
  withTargetPath,
} from './components/admin/TargetPathContext'
import Redirects from './queries/Redirects.graphql'

type Props = CustomProps & WithApolloClient<TargetPathContextProps>

interface CustomProps {
  hasMultipleBindings: boolean
}
interface RedirectListQueryResult {
  redirect: {
    listRedirects: {
      routes: Redirect[]
      next?: string
    }
  }
}

interface RedirectListVariables {
  limit: number
  next?: string
}

const messages = defineMessages({
  error: {
    defaultMessage: 'Something went wrong.',
    id: 'admin/pages.admin.redirects.error',
  },
  retry: {
    defaultMessage: 'Try again',
    id: 'admin/pages.admin.redirects.error.retry',
  },
  showRows: {
    defaultMessage: 'Number of rows',
    id: 'admin/pages.admin.redirects.pagination.showRows',
  },
  title: {
    defaultMessage: 'Redirect list',
    id: 'admin/pages.admin.redirects.title',
  },
})

streamSaver.WritableStream = WebStreamsPolyfill.WritableStream

const textEncoder = new TextEncoder()

const RedirectList: React.FC<Props> = ({
  client,
  setTargetPath,
  hasMultipleBindings,
}) => {
  const intl = useIntl()

  useEffect(() => {
    setTargetPath(WRAPPER_PATH)
  }, [setTargetPath])

  const [isModalOpen, setIsModalOpen] = useState(false)

  const [filteredRedirectList, setFilteredRedirectList] = useState<any>([])

  const [
    { paginationFrom, paginationTo },
    setPagination,
  ] = useState({
    paginationFrom: PAGINATION_START,
    paginationTo: PAGINATION_START + PAGINATION_STEP,
  })

  const [alertState, setAlert] = useState<AlertState | null>(null)

  const [isImportErrorModalOpen, setIsImportErrorModalOpen] = useState(false)

  const openModal = useCallback(() => {
    setIsModalOpen(true)
  }, [setIsModalOpen])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [setIsModalOpen])

  const resetAlert = useCallback(() => {
    setAlert(null)
  }, [setAlert])

  const handleOpenErrorModal = useCallback(() => {
    setIsImportErrorModalOpen(true)
  }, [setIsImportErrorModalOpen])

  const handleCloseErrorModal = useCallback(() => {
    setIsImportErrorModalOpen(false)
  }, [setIsImportErrorModalOpen])

  const handleDownloadTemplate = () => {
    const fileStream = streamSaver.createWriteStream('redirects_template.csv')
    const writer = fileStream.getWriter()
    writer.write(textEncoder.encode(getCSVTemplate(hasMultipleBindings)))
    writer.close()
  }

  const handleDownload = useCallback(async () => {
    const fileStream = streamSaver.createWriteStream('redirects.csv')
    const writer = fileStream.getWriter()
    let next: string | undefined

    writer.write(textEncoder.encode(getCSVHeader(hasMultipleBindings) + '\n'))
    do {
      const response = await client.query<
        RedirectListQueryResult,
        RedirectListVariables
      >({
        query: Redirects,
        variables: {
          limit: REDIRECTS_LIMIT,
          next,
        },
      })
      const redirects = response.data.redirect.listRedirects.routes
      next = response.data.redirect.listRedirects.next
      redirects.forEach(({ endDate, from, to, type, binding }) => {
        const bindingString = hasMultipleBindings ? `${binding || ''};` : ''
        writer.write(
          textEncoder.encode(
            `${from};${to};${type};${bindingString}${endDate || ''}\n`
          )
        )
      })
    } while (next !== null)
    writer.close()
  }, [client, hasMultipleBindings])

  const getNextPageNavigationHandler = (
    dataLength: number,
    fetchMore: QueryResult<
      RedirectListQueryResult,
      RedirectListVariables
    >['fetchMore'],
    nextToken?: string
  ) => async () => {
    if (!nextToken && paginationFrom >= dataLength) {
      return
    }
    const maybeNextPaginationTo = paginationTo + PAGINATION_STEP

    if (maybeNextPaginationTo > dataLength && nextToken) {
      await fetchMore({
        updateQuery: (prevData, { fetchMoreResult }) => {
          if (!fetchMoreResult) {
            return prevData
          }
          prevData.redirect.listRedirects.routes = prevData.redirect.listRedirects.routes.concat(
            fetchMoreResult.redirect.listRedirects.routes
          )
          prevData.redirect.listRedirects.next =
            fetchMoreResult.redirect.listRedirects.next
          return prevData
        },
        variables: {
          limit: REDIRECTS_LIMIT,
          next: nextToken,
        },
      })
    }

    const nextPaginationTo =
      maybeNextPaginationTo > dataLength ? dataLength : maybeNextPaginationTo
    setPagination(prevState => ({
      paginationFrom:
        prevState.paginationTo >= nextPaginationTo
          ? prevState.paginationFrom
          : prevState.paginationTo,
      paginationTo: nextPaginationTo,
    }))
  }
  const handlePrevPageNavigation = useCallback(() => {
    setPagination(prevState => ({
      paginationFrom:
        prevState.paginationFrom - PAGINATION_STEP < 0
          ? 0
          : prevState.paginationFrom - PAGINATION_STEP,
      paginationTo: prevState.paginationFrom,
    }))
  }, [setPagination])

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage(messages.title)}</title>
      </Helmet>
      <Query<RedirectListQueryResult, RedirectListVariables>
        notifyOnNetworkStatusChange
        query={Redirects}
        variables={{
          limit: REDIRECTS_LIMIT,
        }}
      >
        {({ data, fetchMore, loading, refetch, error }) => {
          const redirects = data?.redirect?.listRedirects.routes || []
          const hasRedirects = redirects.length > 0

          if (error) {
            return (
              <>
                {intl.formatMessage(messages.error)}
                <button
                  className="bg-transparent bn c-action-primary pointer"
                  onClick={() => {
                    refetch({ limit: REDIRECTS_LIMIT })
                  }}
                >
                  {intl.formatMessage(messages.retry)}
                </button>
              </>
            )
          }
          const next = data?.redirect?.listRedirects.next
          if (next && redirects.length < PAGINATION_STEP) {
            refetch({ limit: REDIRECTS_LIMIT, next })
          }
          useEffect(()=>{
            setFilteredRedirectList(redirects)
          }, [redirects])
          return (
            <ToastConsumer>
              {({ showToast }) => (
                <>
                  {alertState && (
                    <div className="mb4">
                      <Alert
                        type={alertState.type}
                        onClose={resetAlert}
                        action={
                          alertState.meta && alertState.action
                            ? {
                                ...alertState.action,
                                onClick: handleOpenErrorModal,
                              }
                            : undefined
                        }
                      >
                        {alertState.message}
                      </Alert>
                    </div>
                  )}
                  {isImportErrorModalOpen && alertState?.meta && (
                    <ImportErrorModal
                      isSave={alertState.meta.isSave}
                      isOpen={isImportErrorModalOpen}
                      mutation={alertState.meta.mutation}
                      onClose={handleCloseErrorModal}
                      redirects={alertState.meta.failedRedirects}
                      setAlert={setAlert}
                      hasMultipleBindings={hasMultipleBindings}
                    />
                  )}
                  <Box>
                    <List
                      loading={loading}
                      from={paginationFrom}
                      items={filteredRedirectList.slice(paginationFrom, paginationTo)}
                      refetch={() => {
                        refetch({
                          limit: REDIRECTS_LIMIT,
                        })
                      }}
                      to={paginationTo}
                      showToast={showToast}
                      openModal={openModal}
                      onHandleDownload={handleDownload}
                      onSearch = {(e) => {setFilteredRedirectList(redirects.filter((value)=>{
                        return value.from.includes(e.target.value) || value.to.includes(e.target.value)
                      }))}}
                    />
                    {redirects.length > 0 && (
                      <Pagination
                        currentItemFrom={paginationFrom + 1}
                        currentItemTo={paginationTo}
                        onNextClick={getNextPageNavigationHandler(
                          redirects.length,
                          fetchMore,
                          next
                        )}
                        textOf=""
                        onPrevClick={handlePrevPageNavigation}
                        textShowRows={intl.formatMessage(messages.showRows)}
                      />
                    )}
                    <UploadModal
                      isOpen={isModalOpen}
                      hasRedirects={hasRedirects}
                      onClose={closeModal}
                      onDownloadTemplate={handleDownloadTemplate}
                      refetchRedirects={refetch}
                      setAlert={setAlert}
                      hasMultipleBindings={hasMultipleBindings}
                    />
                  </Box>
                </>
              )}
            </ToastConsumer>
          )
        }}
      </Query>
    </>
  )
}

export default withApollo(withTargetPath(RedirectList))
