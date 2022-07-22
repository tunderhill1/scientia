import { plainToInstance } from 'class-transformer'
import React, { createContext, useContext, useEffect, useState } from 'react'

import { UserDetails } from '../constants/types'

/**
 * The materials and emarking login endpoints don't return user information, so we update the username in the context
 * based on if the login was successful. The provider type will be updated if and when the materials API exposes a way
 * to retrieve user information; currently, UserSchema is unused.
 *
 * TODO: It's worth investigating reducers for updating the context instead of always having to pass around a set state
 * function.
 */

export type Role = undefined | 'student' | 'staff'
type UserProviderType = {
  userDetails: UserDetails
  storeUserDetails: (userDetails: UserDetails) => void
  clearUserDetails: () => void
}

export const USER_DETAILS_PLACEHOLDER = plainToInstance(UserDetails, { username: '' })

const defaultUser = {
  userDetails: USER_DETAILS_PLACEHOLDER,
  storeUserDetails: (_: UserDetails) => {},
  clearUserDetails: () => {},
}

const UserContext = createContext<UserProviderType>(defaultUser)

/* The username can be retrieved and set from anywhere in the app. */
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userDetails, setUserDetails] = useState<UserDetails>(defaultUser.userDetails)

  /* TODO: Use a reducer when there's more data to handle; also, there's a delay on refresh - needs investigation */
  useEffect(() => {
    const storedUserDetails = localStorage.getItem('userDetails')
    if (storedUserDetails) setUserDetails(JSON.parse(storedUserDetails))
  }, [])

  const storeUserDetails = (userDetails: UserDetails) => {
    setUserDetails(userDetails)
    localStorage.setItem('userDetails', JSON.stringify(userDetails))
  }

  const clearUserDetails = () => {
    setUserDetails(USER_DETAILS_PLACEHOLDER)
    localStorage.removeItem('userDetails')
  }

  return (
    <UserContext.Provider value={{ userDetails, storeUserDetails, clearUserDetails }}>{children}</UserContext.Provider>
  )
}

/* Allow user information to be accessed and updated in any functional component using the following hook: */
export const useUser = () => useContext(UserContext)
