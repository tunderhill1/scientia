import { Buffer } from 'buffer'

/**
 * The token service manages the storage of JWT tokens from the auth service; the refresh token is used for
 * authentication and the access token is used for authorisation.
 */

export default function useToken() {
  const saveToken = (token: string, type: 'access' | 'refresh') => {
    window.localStorage.setItem(type + '-token', token)
  }

  const removeTokens = () => {
    window.localStorage.removeItem('access-token')
    window.localStorage.removeItem('refresh-token')
  }

  const getToken = (type: 'access' | 'refresh') => {
    return window.localStorage.getItem(type + '-token')
  }

  const isExpired = (type: 'access' | 'refresh') => {
    const token = getToken(type)
    if (!token) return true /* Token's expired if it doesn't exist */
    const tokenDetails = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
    const expiration = new Date(tokenDetails.exp * 1000)
    return expiration.getTime() <= Date.now()
  }

  return { saveToken, removeTokens, getToken, isExpired }
}
