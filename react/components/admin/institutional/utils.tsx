import { AvailableApp, InstalledApp } from '../../EditorContainer/StoreEditor/Store/StoreForm/components/withStoreSettings'

export const parseStoreAppId = (store: InstalledApp & AvailableApp & { settings: string }) => {
  const appMajor = store.version.split('.')[0]
  return `${store.slug}@${appMajor}.x`
}