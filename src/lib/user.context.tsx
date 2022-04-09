import React, { createContext, useContext, useState } from 'react'

/**
 * The materials and emarking login endpoints don't return user information, so we update the username in the context
 * based on if the login was successful. The provider type will be updated if and when the materials API exposes a way
 * to retrieve user information; currently, UserSchema is unused.
 *
 * TODO: It's worth investigating reducers for updating the context instead of always having to pass around a set state
 * function.
 */

type UserProviderType = { username: string; setUsername: (username: string) => void }

const defaultUser = {
  username: '',
  setUsername: (_: string) => {},
}

const UserContext = createContext<UserProviderType>(defaultUser)

/* The username can be retrieved and set from anywhere in the app. */
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState(defaultUser.username)

  /* TODO: Store and retrieve user information from localStorage. Also, you could use a reducer instead of the state! */
  return <UserContext.Provider value={{ username, setUsername }}>{children}</UserContext.Provider>
}

/* Allow user information to be accessed and updated in any functional component using the following hook: */
export const useUser = () => useContext(UserContext)
