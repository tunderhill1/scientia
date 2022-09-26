import { instanceToPlain, plainToInstance } from 'class-transformer'
import { ReactNode, createContext, useContext, useState } from 'react'

import { UserDetails } from '../constants/types'

type UserProviderType = {
  userDetails: UserDetails | undefined
  storeUserDetails: (userDetails: UserDetails) => void
  clearUserDetails: () => void
}

const defaultUser = {
  userDetails: undefined,
  storeUserDetails: (_: UserDetails) => {},
  clearUserDetails: () => {},
}

const UserContext = createContext<UserProviderType>(defaultUser)

function getUserDetailsOrUndefined(): UserDetails | undefined {
  const storedUserDetails = localStorage.getItem('userDetails')
  if (storedUserDetails) return plainToInstance(UserDetails, JSON.parse(storedUserDetails))
}

/* The username can be retrieved and set from anywhere in the app. */
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | undefined>(
    getUserDetailsOrUndefined()
  )

  const storeUserDetails = (userDetails: UserDetails) => {
    setUserDetails(userDetails)
    localStorage.setItem('userDetails', JSON.stringify(instanceToPlain(userDetails)))
  }

  const clearUserDetails = () => {
    setUserDetails(undefined)
    localStorage.removeItem('userDetails')
  }

  return (
    <UserContext.Provider value={{ userDetails, storeUserDetails, clearUserDetails }}>
      {children}
    </UserContext.Provider>
  )
}

/* Allow user information to be accessed and updated in any functional component using the following hook: */
export const useUser = () => useContext(UserContext)
