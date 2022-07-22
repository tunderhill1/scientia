import axios from 'axios'
import { plainToInstance } from 'class-transformer'
import { useNavigate } from 'react-router-dom'

import { endpoints } from '../constants/endpoints'
import { UserDetails } from '../constants/types'
import { CSRF_ACCESS_COOKIE, getCookie } from './axios.context'
import { useUser } from './user.context'

/**
 * TODO: The plan is to process authentication- and authorisation-related queries here and update the user context based
 * on the response. This place deals with the JWT and its storage management (cookies).
 *
 * NOTE: It'd be a good idea to section this off into a services folder and possibly move the providers into a hooks
 * folder? Though, we'd have to reason out what actually goes inside lib.
 */

type Credentials = {
  username: string
  password: string
}

export default function useAuth() {
  const { storeUserDetails, clearUserDetails } = useUser()
  const navigate = useNavigate()

  const loginUser = async (data: Credentials) => {
    /* TODO: Use the axios hook here instead! */
    return axios({
      url: endpoints.login,
      method: 'post',
      data: data,
    })
      .then((response) => {
        storeUserDetails(plainToInstance(UserDetails, response.data))
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const isLoggedIn = (): boolean => {
    return localStorage.hasOwnProperty('userDetails') && localStorage.getItem('userDetails') !== ''
  }

  const logoutUser = () => {
    axios({
      url: endpoints.logout,
      method: 'delete',
      headers: { 'X-CSRF-TOKEN': getCookie(CSRF_ACCESS_COOKIE) },
    })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        clearUserDetails()
        navigate('/')
      })
  }

  return { loginUser, logoutUser, isLoggedIn }
}
