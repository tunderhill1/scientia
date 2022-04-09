/**
 * TODO: The plan is to process authentication- and authorisation-related queries here and update the user context based
 * on the response. This place deals with the JWT and its storage management (cookies).
 *
 * NOTE: It'd be a good idea to section this off into a services folder and possibly move the providers into a hooks
 * folder? Though, we'd have to reason out what actually goes inside lib.
 */

import axios from 'axios'
import { endpoints } from '../constants/endpoints'
import { useUser } from './user.context'

type Credentials = {
  username: string
  password: string
}

export default function useAuth() {
  const { setUsername } = useUser()

  const setUserContext = (username: string) => {
    /**
     * TODO: Later on when the API provides user information, this function can be modified in two ways:
     * 1. Take in the body of the response from the login endpoint containing user information
     * 2. Make a call to a separate endpoint like /user to query user information (fn. would be async)
     * In both cases, a reducer would have to be used to update the user context.
     */
    setUsername(username)
  }

  const loginUser = async (data: Credentials) => {
    return axios({
      url: endpoints.login,
      method: 'post',
      data: data,
    })
      .then((response) => {
        /* TODO: Call upon the token service to store these tokens in cookies? */
        console.log(response.data)
        setUserContext(data.username)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  return { loginUser }
}
