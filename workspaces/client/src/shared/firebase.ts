import { initializeApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
import config from './config'
import { socialLoginAsync } from 'src/features/app'

export function getFirebaseApp() {
  return initializeApp({
    projectId: config.settings?.google?.projectId,
    apiKey: config.settings?.google?.apiKey,
    messagingSenderId: config.settings?.google?.messagingSenderId,
    measurementId: config.settings?.google?.analyticsId,
    authDomain: `${config.settings?.google?.projectId}.firebaseapp.com`,
    storageBucket: `${config.settings?.google?.projectId}.appspot.com`,
    databaseURL: `https://${config.settings?.google?.projectId}.firebaseio.com`
  })
}

export async function passwordLogin(email: string, password: string) {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  const credential = await signInWithEmailAndPassword(auth, email, password)

  socialLoginAsync({ ...credential })

  return credential
}
