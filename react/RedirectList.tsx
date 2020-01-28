import React, { useCallback, useEffect, useState } from 'react'
import { Query, QueryResult, withApollo, WithApolloClient } from 'react-apollo'
import { defineMessages, useIntl } from 'react-intl'
import streamSaver from 'streamsaver'
import { TextEncoder } from 'text-encoding'
import { Helmet } from 'vtex.render-runtime'
import { Alert, Box, Pagination, ToastConsumer } from 'vtex.styleguide'
import * as WebStreamsPolyfill from 'web-streams-polyfill/ponyfill'

import {
  CSV_HEADER,
  CSV_TEMPLATE,
  PAGINATION_START,
  PAGINATION_STEP,
  WRAPPER_PATH,
} from './components/admin/redirects/consts'
import ImportErrorModal from './components/admin/redirects/ImportErrorModal'
import List from './components/admin/redirects/List'
import UploadModal from './components/admin/redirects/UploadModal'
import { AlertState } from './components/admin/redirects/typings'
import {
  TargetPathContextProps,
  withTargetPath,
} from './components/admin/TargetPathContext'
import Loader from './components/Loader'
import Redirects from './queries/Redirects.graphql'

type Props = WithApolloClient<TargetPathContextProps>

interface RedirectListQueryResult {
  redirect: {
    list: Redirect[]
    numberOfEntries: number
  }
}

interface RedirectListVariables {
  from: number
  to: number
  fetchMoreResult?: RedirectListQueryResult
}

const messages = defineMessages({
  paginationOf: {
    defaultMessage: 'of',
    id: 'admin/pages.admin.redirects.pagination.of',
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

const getNextPaginationTo = (paginationFrom: number, total: number) =>
  total > paginationFrom + PAGINATION_STEP
    ? paginationFrom + PAGINATION_STEP
    : total

const handleDownloadTemplate = () => {
  const fileStream = streamSaver.createWriteStream('redirects_template.csv')
  const writer = fileStream.getWriter()
  writer.write(textEncoder.encode(CSV_TEMPLATE))
  writer.close()
}

const RedirectList: React.FC<Props> = ({ client, setTargetPath }) => {
  const intl = useIntl()

  useEffect(() => {
    setTargetPath(WRAPPER_PATH)
  }, [setTargetPath])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [
    { paginationFrom, paginationTo: statePaginationTo },
    setPagination,
  ] = useState({
    paginationFrom: PAGINATION_START,
    paginationTo: PAGINATION_START + PAGINATION_STEP,
  })
  const [alertState, setAlert] = useState<AlertState | null>(null)

  const paginationTo = statePaginationTo && statePaginationTo - 1

  const openModal = useCallback(() => {
    setIsModalOpen(true)
  }, [setIsModalOpen])

  const closeModal = useCallback(() => {
    setIsModalOpen(false)
  }, [setIsModalOpen])

  const handleDownload = useCallback(async () => {
    const STEP = 999

    const fileStream = streamSaver.createWriteStream('redirects.csv')
    const writer = fileStream.getWriter()
    let current = 0
    let list: Redirect[] | null = []

    writer.write(textEncoder.encode(CSV_HEADER + '\n'))
    while (list !== null) {
      const response = await client.query<
        RedirectListQueryResult,
        RedirectListVariables
      >({
        query: Redirects,
        variables: {
          from: current,
          to: current + STEP,
        },
      })
      current += STEP + 1
      response.data.redirect.list.forEach(({ endDate, from, to, type }) => {
        writer.write(
          textEncoder.encode(`${from};${to};${type};${endDate || ''}\n`)
        )
      })

      list =
        response.data.redirect.list.length === STEP + 1
          ? response.data.redirect.list
          : null
    }
    writer.close()
  }, [client])

  const getNextPageNavigationHandler = (
    dataLength: number,
    total: number,
    fetchMore: QueryResult<
      RedirectListQueryResult,
      RedirectListVariables
    >['fetchMore']
  ) => async () => {
    const nextPaginationTo = getNextPaginationTo(
      paginationFrom + PAGINATION_STEP,
      total
    )

    if (nextPaginationTo > dataLength) {
      await fetchMore({
        updateQuery: (prevData, { fetchMoreResult }) =>
          fetchMoreResult
            ? {
                ...prevData,
                redirect: {
                  ...prevData.redirect,
                  list: [
                    ...prevData.redirect.list,
                    ...fetchMoreResult.redirect.list,
                  ],
                },
              }
            : prevData,
        variables: {
          from: paginationTo,
          to: nextPaginationTo,
        },
      })
    }

    setPagination(prevState => ({
      paginationFrom: prevState.paginationTo,
      paginationTo: nextPaginationTo,
    }))
  }

  const handlePrevPageNavigation = useCallback(() => {
    setPagination(prevState => ({
      paginationFrom: prevState.paginationFrom - PAGINATION_STEP,
      paginationTo: prevState.paginationFrom,
    }))
  }, [setPagination])

  const [isImportErrorModalOpen, setIsImportErrorModalOpen] = useState(false)

  return (
    <>
      <Helmet>
        <title>{intl.formatMessage(messages.title)}</title>
      </Helmet>
      <Query<RedirectListQueryResult, RedirectListVariables>
        notifyOnNetworkStatusChange
        query={Redirects}
        variables={{
          from: PAGINATION_START,
          to: PAGINATION_STEP,
        }}
      >
        {({ data, fetchMore, loading, refetch, error }) => {
          const redirects = (data && data.redirect && data.redirect.list) || []
          const total =
            (data && data.redirect && data.redirect.numberOfEntries) || 0
          const hasRedirects = redirects.length > 0

          if (loading) {
            return <Loader />
          }

          if (error) {
            return <div> Something went wrong. </div>
          }

          return (
            <ToastConsumer>
              {({ showToast }) => (
                <>
                  {alertState && (
                    <div className="mb4">
                      <Alert
                        type={alertState.type}
                        onClose={() => setAlert(null)}
                        action={
                          alertState.meta && alertState.action
                            ? {
                                ...alertState.action,
                                onClick: () => setIsImportErrorModalOpen(true),
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
                      onClose={() => setIsImportErrorModalOpen(false)}
                      redirects={alertState.meta.failedRedirects}
                      setAlert={setAlert}
                    />
                  )}
                  <Box>
                    <List
                      from={paginationFrom}
                      items={redirects.slice(paginationFrom, paginationTo)}
                      refetch={() => {
                        refetch({
                          from: PAGINATION_START,
                          to: PAGINATION_STEP,
                        })
                      }}
                      to={paginationTo}
                      showToast={showToast}
                      openModal={openModal}
                      onHandleDownload={handleDownload}
                    />
                    {total > 0 && (
                      <Pagination
                        currentItemFrom={paginationFrom + 1}
                        currentItemTo={paginationTo + 1}
                        onNextClick={getNextPageNavigationHandler(
                          redirects.length,
                          total,
                          fetchMore
                        )}
                        onPrevClick={handlePrevPageNavigation}
                        textOf={intl.formatMessage(messages.paginationOf)}
                        textShowRows={intl.formatMessage(messages.showRows)}
                        totalItems={total}
                      />
                    )}
                    <UploadModal
                      isOpen={isModalOpen}
                      hasRedirects={hasRedirects}
                      onClose={closeModal}
                      onDownloadTemplate={handleDownloadTemplate}
                      refetchRedirects={refetch}
                      setAlert={setAlert}
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
