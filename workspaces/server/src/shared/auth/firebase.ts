import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword
} from 'firebase/auth'
import config from '../config'

export const getFirebaseApp = () => {
  const google = config.settings?.google
  const projectId = google?.projectId
  const authDomain = `${projectId}.firebaseapp.com`
  const storageBucket = `${projectId}.appspot.com`
  const app = initializeApp({
    apiKey: google?.apiKey,
    projectId,
    authDomain,
    storageBucket,
    messagingSenderId: google?.senderId,
    appId: google?.appId,
    measurementId: google?.analyticsId
  })

  return app
}

export const getFirebaseAuth = () => getAuth(getFirebaseApp())

export const firebaseCredentialLogin = (credential: any) => {
  return signInWithCredential(getFirebaseAuth(), credential)
}

export const firebaseLogin = (email: string, password: string) => {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password)
}

export const firebaseLogout = () => {
  return getFirebaseAuth().signOut()
}

export const firebaseRegister = ({ email, password }: Record<string, string>) => {
  return createUserWithEmailAndPassword(getFirebaseAuth(), email, password)
}
