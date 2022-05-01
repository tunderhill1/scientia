import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../lib/auth.service'

/**
 * A protected route checks if a user is logged in before allowing a route to succeed. If not, they're
 * redirected to page at the redirect path (login by default).
 *
 * TODO: Wrap header and possibly footer components around the outlet. Else create a separate layout component that
 * would add the header and footer with an option to disable it for certain pages.
 */
export const ProtectedRoute = ({ redirectPath = '/' }) => {
  const { isLoggedIn } = useAuth()
  return isLoggedIn() ? <Outlet /> : <Navigate to={redirectPath} replace />
}
