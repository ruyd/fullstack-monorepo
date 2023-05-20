import { initializeApp } from 'firebase/app'
import { getAuth, signInWithCredential } from 'firebase/auth'

const app = initializeApp({
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECTID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDERID,
  appId: process.env.FIREBASE_APPID,
  measurementId: process.env.FIREBASE_MEASUREMENTID
})

export const firebaseAuth = getAuth(app)

export const fireSigninWithCredential = (credential: any) => {
  return signInWithCredential(firebaseAuth, credential)
}
