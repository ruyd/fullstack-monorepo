import { DecodedIdToken, getAuth } from 'firebase-admin/auth'
import { getFirebaseApp } from '../firebase'
import { UserModel } from '../types'
import { IdentityToken, oAuthError, oAuthInputs, oAuthRegistered, oAuthResponse } from '@lib'
import { decode } from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import { getSettingsAsync } from '../settings'
import { randomUUID } from 'crypto'

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

async function getUserWithPropUpdate({
  email,
  picture,
  given_name,
  family_name
}: Record<string, string>) {
  const instance = await UserModel.findOne({
    where: { email }
  })
  const user = instance?.get()
  if (user) {
    let dirty = false
    if (user.picture !== picture && !!picture) {
      user.picture = picture
      dirty = true
    }
    if (user.firstName !== given_name && !!given_name) {
      user.firstName = given_name
      dirty = true
    }
    if (user.lastName !== family_name && !!family_name) {
      user.lastName = family_name
      dirty = true
    }
    if (dirty) {
      await UserModel.update(user, { where: { email: user.email } })
    }
  }
  return user
}

/**
 * Client SDK does the signin and signup calls with this idToken as a result
 * @param param0
 * @returns
 */
export const firebaseCredentialLogin = async ({ idToken }: oAuthInputs): Promise<oAuthResponse> => {
  try {
    const app = await getFirebaseApp()
    const auth = getAuth(app)
    const settings = await getSettingsAsync()
    const clientId = settings?.google?.clientId
    const projectId = settings?.google?.projectId
    if (!clientId || !projectId) {
      throw new Error('Missing google settings: clientId and serviceAccountJson')
    }
    const aud = (decode(idToken as string) as { aud: string })?.aud as string
    let validatedIdentity: DecodedIdToken
    if (aud === projectId) {
      validatedIdentity = await auth.verifyIdToken(idToken as string, true)
    } else {
      validatedIdentity = (
        await new OAuth2Client(clientId).verifyIdToken({
          idToken: idToken as string,
          audience: clientId
        })
      ).getPayload() as DecodedIdToken
    }
    let user = await getUserWithPropUpdate(validatedIdentity)
    if (!user) {
      user = (
        await UserModel.create({
          email: validatedIdentity.email as string,
          userId: randomUUID(),
          picture: validatedIdentity.picture,
          firstName: validatedIdentity.given_name || validatedIdentity.display_name,
          lastName: validatedIdentity.family_name
        })
      )?.get()
    }

    const access_token = await auth.createCustomToken(user.userId, {
      roles: user?.roles?.length ? user.roles : []
    })

    return {
      access_token,
      decoded: validatedIdentity as unknown as IdentityToken,
      user
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
      email
    })

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
