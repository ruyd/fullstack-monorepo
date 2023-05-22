import { getAuth } from 'firebase-admin/auth'
import { getFirebaseApp } from '../firebase'

export const firebaseLogin = async (email: string, idToken: string) => {
  const app = await getFirebaseApp()
  const auth = getAuth(app)
  const user = await auth.getUserByEmail(email)
  if (!user) {
    throw new Error('User not found')
  }

  const result = await auth.verifyIdToken(idToken)
  if (result.uid !== user.uid) {
    throw new Error('User not found')
  }

  return result
}

export const firebaseRegister = async ({ email, ...payload }: Record<string, string>) => {
  const app = await getFirebaseApp()
  const auth = getAuth(app)

  const result = await auth.createUser({
    ...payload,
    email,
    emailVerified: false,
    photoURL: 'http://www.example.com/12345678/photo.png',
    disabled: false
  })
  return result
}
