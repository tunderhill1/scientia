import axios from 'axios'
import { Buffer } from 'buffer'
import { endpoints } from '../constants/endpoints'

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

  const refreshTokens = async () => {
    return axios({
      url: endpoints.refresh,
      method: 'post',
      headers: { Authorization: `Bearer ${getToken('refresh')}` },
    })
      .then((response) => {
        saveToken(response.data.access_token, 'access')
        /* NOTE: Should we save the refresh token as well? */
      })
      .catch((error) => {
        console.log(error)
      })
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

  return { saveToken, removeTokens, refreshTokens, getToken, isExpired }
}
