/* eslint-disable @typescript-eslint/no-unused-vars */
import { initializeApp, type FirebaseApp } from 'firebase/app'
import {
  UserCredential,
  getAuth,
  signInWithCustomToken,
  signInWithEmailAndPassword
} from 'firebase/auth'
import config from './config'
import { request } from 'src/features/app'
import { AppUser } from './auth'

let firebaseApp: FirebaseApp | null = null
export function getFirebaseApp() {
  if (firebaseApp) {
    return firebaseApp
  }

  const firebaseConfig = {
    apiKey: 'AIzaSyDoBAZHetVo7nx5iKkfIHD6JFZf6pZ229w',
    authDomain: 'drawspace-6c652.firebaseapp.com',
    projectId: 'drawspace-6c652',
    storageBucket: 'drawspace-6c652.appspot.com',
    messagingSenderId: '713284092696',
    appId: '1:713284092696:web:d0433bf5a53abd90fed46d',
    measurementId: 'G-DB561ZZ8PB'
  }

  // Initialize Firebase
  // const app = initializeApp(firebaseConfig)
  const settings = config.settings
  const projectId = settings?.google?.projectId
  const params = {
    apiKey: settings?.google?.apiKey,
    authDomain: `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: `${projectId}.appspot.com`,
    messagingSenderId: settings?.google?.messagingSenderId,
    appId: settings?.google?.appId,
    measurementId: settings?.google?.analyticsId
  }
  firebaseApp = initializeApp(firebaseConfig)
  return firebaseApp
}

export async function firebasePasswordLogin(
  email: string,
  password: string
): Promise<Partial<UserCredential> & { idToken: string }> {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const idToken = await credential.user.getIdToken()
  // const idToken = (credential.user as unknown as { accessToken: string }).accessToken
  return {
    ...credential.user,
    idToken
  }
}

export async function firebaseCustomTokenLogin(
  token: string
): Promise<UserCredential & { user: { accessToken: string } }> {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  const credential = await signInWithCustomToken(auth, token)
  return credential as UserCredential & { user: { accessToken: string } }
}
