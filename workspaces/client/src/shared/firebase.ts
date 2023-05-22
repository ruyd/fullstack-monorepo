/* eslint-disable @typescript-eslint/no-unused-vars */
import { initializeApp, FirebaseApp } from 'firebase/app'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'
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

  const projectId = config.settings?.google?.projectId
  const params = {
    apiKey: config.settings?.google?.apiKey,
    authDomain: `${projectId}.firebaseapp.com`,
    projectId,
    storageBucket: `${projectId}.appspot.com`,
    messagingSenderId: config.settings?.google?.messagingSenderId,
    appId: config.settings?.google?.appId,
    measurementId: config.settings?.google?.analyticsId
  }
  firebaseApp = initializeApp(firebaseConfig)
  return firebaseApp
}

export async function firebasePasswordLogin(email: string, password: string) {
  const app = getFirebaseApp()
  const auth = getAuth(app)
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return credential
}
