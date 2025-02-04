import { MutableRefObject } from 'react'
import { splitEvery } from 'ramda'

const MAX_REDIRECTS_PER_REQUEST = 200
const NUMBER_OF_RETRIES = 3

interface BulkUploadRedirectsArgs {
  data: Redirect[]
  mutation: (data: Redirect[]) => Promise<void>
  isSave: boolean
  shouldUploadRef: MutableRefObject<boolean>
  updateProgress?: (processed: number) => void
}

export default async function bulkUploadRedirects({
  data,
  mutation,
  shouldUploadRef,
  updateProgress = () => {
    return undefined
  },
}: BulkUploadRedirectsArgs): Promise<{ failedRedirects: Redirect[] }> {
  let failedRedirects: Redirect[] = []
  let processedCount = 0

  const redirectBatches = splitEvery(MAX_REDIRECTS_PER_REQUEST, data)

  for (const payload of redirectBatches) {
    if (!shouldUploadRef.current) {
      break
    }

    for (let i = 1; i <= NUMBER_OF_RETRIES; i++) {
      try {
        await mutation(payload)
        processedCount += payload.length
        updateProgress(processedCount)
        break
      } catch (e) {
        await new Promise(res => {
          setTimeout(() => res(), i * 750)
        })
        if (i === NUMBER_OF_RETRIES) {
          failedRedirects = failedRedirects.concat(payload)
        }
      }
    }

    await new Promise(res => {
      setTimeout(() => res(), 750)
    })
  }

  return { failedRedirects }
}
