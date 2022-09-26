import { useEffect, useState } from 'react'
import { Navigate, Outlet, useParams } from 'react-router-dom'

import { currentShortYear, validShortYears } from '../lib/utilities.service'

/**
 * A year route takes care of switching the academic year for resources (in a global context)
 * based on the year parameter supplied in the URL path.
 */
export const YearRoute = () => {
  const [redirect, setRedirect] = useState(false)

  const { requestedYear } = useParams()

  useEffect(() => {
    const years = validShortYears()
    /* NOTE: Please don't simplify this to just compute setRedirect(condition) to maintain readability */
    if (requestedYear === undefined) {
      setRedirect(true)
    } else {
      // if user typed a year that ISNT the current year AND is not in valid years list (2122, 2223)
      setRedirect(requestedYear !== currentShortYear() && !years.includes(requestedYear))
    }
  }, [requestedYear])

  return redirect ? <Navigate to="/" replace /> : <Outlet />
}
