import { initializeApp, cert, App } from 'firebase-admin/app'
import { getSettingsAsync } from './settings'

let firebaseApp: App | null = null
export const getFirebaseApp = async (): Promise<App> => {
  if (firebaseApp) {
    return firebaseApp
  }

  const settings = await getSettingsAsync()

  const google = settings?.google

  if (!google?.serviceAccountKeyJson) {
    throw new Error('To use firebase authentication you need to input your serviceAccountKey.json')
  }

  const serviceAccountObject = JSON.parse(google?.serviceAccountKeyJson || '{}')
  const projectId = serviceAccountObject?.projectId
  const storageBucket = `${projectId}.appspot.com`
  const databaseURL = `https://${projectId}.firebaseio.com`
  const credential = serviceAccountObject ? cert(serviceAccountObject) : undefined
  firebaseApp = initializeApp({
    credential,
    databaseURL,
    storageBucket
  })
  return firebaseApp as App
}
