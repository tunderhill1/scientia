import { useEffect, useState } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useYear } from '../lib/year.context'

/**
 * A year route takes care of switching the academic year for resources (in a global context) based on the year
 * parameter supplied in the URL path.
 */
export const YearRoute = () => {
  const [redirect, setRedirect] = useState<boolean>(false)

  const { year, changeYear } = useYear()
  const { requestedYear } = useParams()

  useEffect(() => {
    /* NOTE: Please don't simplify this to just compute setRedirect(condition) to maintain readability */
    if (requestedYear === undefined) setRedirect(true)
    else {
      const requestedYearInt = parseInt(requestedYear)
      setRedirect(requestedYearInt !== year && !changeYear(requestedYearInt))
    }
  }, [changeYear, requestedYear, year])

  return redirect ? <Navigate to="/" replace /> : <Outlet />
}
