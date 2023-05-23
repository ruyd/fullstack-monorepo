import { getAuth } from 'firebase-admin/auth'
import { getFirebaseApp } from '../firebase'
import { UserModel } from '../types'
import { oAuthError, oAuthInputs, oAuthRegistered, oAuthResponse } from '@lib'

export interface FirebaseAuthResponse {
  kind: string
  localId: string
  email: string
  displayName: string
  idToken: string
  registered: boolean
  refreshToken: string
  expiresIn: string
}

export const firebaseCredentialLogin = async ({ idToken }: oAuthInputs): Promise<oAuthResponse> => {
  const app = await getFirebaseApp()
  const auth = getAuth(app)

  try {
    const result = await auth.verifyIdToken(idToken as string, true)
    const user = (
      await UserModel.findOne({
        where: {
          email: result.email
        }
      })
    )?.get()
    const access_token = await auth.createCustomToken(result.uid, {
      roles: user?.roles?.length ? [user?.roles] : []
    })

    return {
      access_token
    }
  } catch (err) {
    const error = err as Error
    return {
      error: error.message,
      error_description: error.message
    }
  }
}

export const firebaseRegister = async ({
  email,
  ...payload
}: oAuthInputs): Promise<oAuthRegistered> => {
  try {
    const app = await getFirebaseApp()
    const auth = getAuth(app)
    const result = await auth.createUser({
      ...payload,
      email,
      emailVerified: false
    })

    // await auth.setCustomUserClaims(result.uid, {
    //   roles: ['user']
    // })

    return { ...result } as unknown as oAuthRegistered
  } catch (err) {
    const error = err as Error
    return {
      error: error.message
    }
  }
}

export const firebaseCreateToken = async (
  uid: string,
  claims: { roles: string[] }
): Promise<string | oAuthError> => {
  try {
    const app = await getFirebaseApp()
    const auth = getAuth(app)
    const access_token = await auth.createCustomToken(uid, claims)
    return access_token
  } catch (err) {
    const error = err as Error
    return {
      error: error.message
    }
  }
}
