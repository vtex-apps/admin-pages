import {
  AvailableApp,
  InstalledApp,
} from '../store/StoreForm/components/withStoreSettings'

export const parseStoreAppId = (
  store: InstalledApp & AvailableApp & { settings: string }
) => {
  const appMajor = store.version.split('.')[0]
  return `${store.slug}@${appMajor}.x`
}
