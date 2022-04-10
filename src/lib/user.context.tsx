import React, { createContext, useContext, useEffect, useState } from 'react'

/**
 * The materials and emarking login endpoints don't return user information, so we update the username in the context
 * based on if the login was successful. The provider type will be updated if and when the materials API exposes a way
 * to retrieve user information; currently, UserSchema is unused.
 *
 * TODO: It's worth investigating reducers for updating the context instead of always having to pass around a set state
 * function.
 */

type UserProviderType = { username: string; storeUsername: (username: string) => void }

const defaultUser = {
  username: '',
  storeUsername: (_: string) => {},
}

const UserContext = createContext<UserProviderType>(defaultUser)

/* The username can be retrieved and set from anywhere in the app. */
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState(defaultUser.username)

  /* TODO: Use a reducer when there's more data to handle; also, there's a delay on refresh - needs investigation */
  useEffect(() => {
    const storedUsername = window.localStorage.getItem('username')
    if (storedUsername) setUsername(storedUsername)
  }, [])

  const storeUsername = (username: string) => {
    setUsername(username)
    window.localStorage.setItem('username', username)
  }

  return <UserContext.Provider value={{ username, storeUsername }}>{children}</UserContext.Provider>
}

/* Allow user information to be accessed and updated in any functional component using the following hook: */
export const useUser = () => useContext(UserContext)
