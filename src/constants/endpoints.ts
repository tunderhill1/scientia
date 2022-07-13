/**
 * NOTE: For Mac uses on macOS Monterey, the AirPlay Receiver service occupies port 5000. When running materials, please
 * disable it by opening System Preferences, navigating to Sharing and unchecking the AirPlay Receiver service.
 *
 * NOTE: To configure Scientia for testing on mobile devices over the local network, please add a new constant below
 * that's mapped to your device's IP address and temporarily update the baseURL to use this instead of development:
 * const local = 'http://X.X.X.X:5000'
 * Next, start materials (and/or emarking) with the --host 0.0.0.0 argument.
 *
 * TODO: Not verified after latest updates using docker for local development.
 */

export const baseURL = process.env.API_ENTRYPOINT || 'http://localhost:8080/api'

export const endpoints = {
  login: `${baseURL}/auth/login`,
  logout: `${baseURL}/auth/logout`,
  refresh: `${baseURL}/auth/refresh`,
  courses: (year: string) => `${baseURL}/courses/${year}`,
  resources: `${baseURL}/resources`,
  resourceFile: (id: number) => `${baseURL}/resources/${id}/file`,
  resourcesArchive: `${baseURL}/resources/zipped`,
}
