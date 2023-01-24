import { Navigate, Outlet, useParams } from 'react-router-dom'

import { useUser } from '../lib/user.context'
import { Navigation } from './Navigation'

export const StaffOnlyRoute = () => {
  const { year, moduleCode, exerciseNumber } = useParams()
  const { userDetails } = useUser()
  const redirectPath = `/${year}/modules/${moduleCode}/exercises/${exerciseNumber}`

  return userDetails?.isStaff || userDetails?.isTaForModule(moduleCode!) ? (
    <>
      <Navigation />
      <Outlet />
    </>
  ) : (
    <Navigate to={redirectPath} />
  )
}
