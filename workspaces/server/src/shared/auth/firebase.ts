import { initializeApp, credential as util, auth } from 'firebase-admin'
import {
  createUserWithEmailAndPassword,
  signInWithCredential,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth'
import config from '../config'

export const getFirebaseApp = () => {
  const google = config.settings?.google
  const projectId = google?.projectId
  const storageBucket = `${projectId}.appspot.com`
  const databaseURL = `https://${projectId}.firebaseio.com`
  const serviceAccount = google?.serviceAccountKeyJson
  const credential = serviceAccount ? util.cert(serviceAccount) : undefined
  const app = initializeApp({
    credential,
    storageBucket,
    databaseURL
  })
  return app
}

export const getFirebaseAuth = () => auth(getFirebaseApp())

export const firebaseCredentialLogin = (credential: any) => {
  return signInWithCredential(getFirebaseAuth() as any, credential)
}

export const firebaseLogin = (email: string, password: string) => {
  return signInWithEmailAndPassword(getFirebaseAuth() as any, email, password)
}

export const firebaseLogout = () => {
  return signOut(getFirebaseAuth() as any)
}

export const firebaseRegister = ({ email, password }: Record<string, string>) => {
  return createUserWithEmailAndPassword(getFirebaseAuth() as any, email, password)
}
