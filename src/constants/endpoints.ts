/**
 * NOTE: For Mac uses on macOS Monterey, the AirPlay Receiver service occupies port 5000. When running materials, please
 * disable it by opening System Preferences, navigating to Sharing and unchecking the AirPlay Receiver service.
 */

const development = 'http://127.0.0.1:5000'
const production = 'https://api-materials.doc.ic.ac.uk'
const config = process.env.NODE_ENV === 'production' ? production : development

export const endpoints = {
  login: `${config}/auth/login`,
  refresh: `${config}/auth/refresh`,
  courses: (year: string) => `${config}/courses/${year}`,
}
