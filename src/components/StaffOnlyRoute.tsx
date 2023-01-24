import { ReactNode } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import { useUser } from '../lib/user.context'
import { Navigation } from './Navigation'

export const StaffOnlyRoute = ({ to }: { to: ReactNode }) => {
  const { year, moduleCode, exerciseNumber } = useParams()
  const { userDetails } = useUser()
  const redirectPath = `/${year}/modules/${moduleCode}/exercises/${exerciseNumber}`

  return userDetails?.isStaff || userDetails?.isTaForModule(moduleCode!) ? (
    <>
      <Navigation />
      {to}
    </>
  ) : (
    <Navigate to={redirectPath} />
  )
}
