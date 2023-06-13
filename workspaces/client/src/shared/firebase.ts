import { initializeApp, type FirebaseApp } from 'firebase/app'
import { initializeAnalytics, Analytics, logEvent } from 'firebase/analytics'
import {
  AuthCredential,
  OAuthCredential,
  UserCredential,
  getAuth,
  signInWithCredential,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  signInWithRedirect
} from 'firebase/auth'
import config from './config'

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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const params = {
    apiKey: settings?.google?.apiKey,
    authDomain: `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: `${projectId}.appspot.com`,
    messagingSenderId: settings?.google?.messagingSenderId,
    appId: settings?.google?.appId,
    measurementId: settings?.google?.measurementId
  }
  firebaseApp = initializeApp(firebaseConfig)
  return firebaseApp
}

export let firebaseAnalytics: Analytics | null = null
export function firebaseAppInit() {
  const firstTime = !firebaseApp
  const app = getFirebaseApp()
  if (firstTime) {
    firebaseAnalytics = initializeAnalytics(app)
    logEvent(firebaseAnalytics, 'app_init')
  }
  return app
}

export function sendEvent(eventName: string, eventParams?: Record<string, unknown>) {
  if (!firebaseAnalytics) {
    return
  }
  if (process.env.NODE_ENV !== 'production') {
    return
  }
  logEvent(firebaseAnalytics, eventName, eventParams)
}

export async function firebasePasswordLogin(
  email: string,
  password: string
): Promise<Partial<UserCredential> & { idToken: string }> {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const idToken = await credential.user.getIdToken()
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

export async function firebaseCredentialLogin(accessToken: string): Promise<UserCredential> {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  const credential = await signInWithCredential(auth, { accessToken } as OAuthCredential)
  return credential as UserCredential & { user: { accessToken: string } }
}

export async function firebaseRedirectLogin() {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  const credential = await signInWithRedirect(auth, { providerId: 'google.com' } as AuthCredential)
  return credential as UserCredential & { user: { accessToken: string } }
}
