import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useYear } from '../lib/year.context'

/**
 * A year route takes care of switching the academic year for resources (in a global context) based on the year
 * parameter supplied in the URL path.
 */
export const YearRoute = () => {
  const { year, changeYear } = useYear()
  const { requestedYear } = useParams()

  console.log(requestedYear, parseInt(requestedYear ?? ''), year)

  return requestedYear !== undefined && (parseInt(requestedYear) === year || changeYear(parseInt(requestedYear))) ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  )
}
