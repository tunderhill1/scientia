import React, { createContext, useContext, useEffect, useState } from 'react'

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
  username: string
  role: Role
  storeUsername: (username: string) => void
  storeRole: (role: Role) => void
}

const defaultUser = {
  username: '',
  role: undefined,
  storeUsername: (_: string) => {},
  storeRole: (_: Role) => {},
}

const UserContext = createContext<UserProviderType>(defaultUser)

/* The username can be retrieved and set from anywhere in the app. */
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [username, setUsername] = useState(defaultUser.username)
  const [role, setRole] = useState<Role>(defaultUser.role)

  /* TODO: Use a reducer when there's more data to handle; also, there's a delay on refresh - needs investigation */
  useEffect(() => {
    const storedUsername = localStorage.getItem('username')
    const storedRole = localStorage.getItem('role')
    if (storedUsername) setUsername(storedUsername)
    if (storedRole) setRole(storedRole as Role)
  }, [])

  const storeUsername = (username: string) => {
    setUsername(username)
    localStorage.setItem('username', username)
  }

  const storeRole = (role: Role) => {
    setRole(role)
    localStorage.setItem('role', role ?? '')
  }

  return <UserContext.Provider value={{ username, role, storeUsername, storeRole }}>{children}</UserContext.Provider>
}

/* Allow user information to be accessed and updated in any functional component using the following hook: */
export const useUser = () => useContext(UserContext)
