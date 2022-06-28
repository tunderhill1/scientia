import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { endpoints } from '../constants/endpoints'
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
  const { storeUsername } = useUser()
  const navigate = useNavigate()

  const setUserContext = (username: string) => {
    /**
     * TODO: Later on when the API provides user information, this function can be modified in two ways:
     * 1. Take in the body of the response from the login endpoint containing user information
     * 2. Make a call to a separate endpoint like /user to query user information (fn. would be async)
     * In both cases, a reducer would have to be used to update the user context.
     */
    storeUsername(username)
  }

  const loginUser = async (data: Credentials, remember: boolean) => {
    /* TODO: Use the axios hook here instead! */
    return axios({
      url: endpoints.login,
      method: 'post',
      data: data,
    })
      .then((response) => {
        setUserContext(data.username)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const isLoggedIn = (): boolean => {
    return localStorage.hasOwnProperty('username') && localStorage.getItem('username') !== ''
  }

  const logoutUser = () => {
    axios({
      url: endpoints.login,
      method: 'delete',
      headers: { 'X-CSRF-TOKEN': getCookie(ANTI_CSRF_COOKIE_NAME) },
    })
      .catch((error) => {
        console.log(error)
      })
      .finally(() => {
        setUserContext('')
        navigate('/')
      })
  }

  return { loginUser, logoutUser, isLoggedIn }
}
