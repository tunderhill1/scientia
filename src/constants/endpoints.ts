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

export const baseURL = process.env.REACT_APP_API_ENTRYPOINT || 'http://localhost:8080/api'

export const endpoints = {
  login: `${baseURL}/auth/login`,
  logout: `${baseURL}/auth/logout`,
  refresh: `${baseURL}/auth/refresh`,
  module: (year: string, moduleCode: string) => `${baseURL}/${year}/modules/${moduleCode}`,
  exercises: (year: string) => `${baseURL}/${year}/exercises`,
  exerciseMaterials: (year: string, yearGroup: string, exerciseNumber: number) =>
    `/${year}/${yearGroup}/exercises/${exerciseNumber}/files`,
  submissions: (year: string, moduleCode: string, exerciseNumber: number) =>
    `${baseURL}/${year}/${moduleCode}/exercises/${exerciseNumber}/submissions`,
  submission: (year: string, moduleCode: string, exerciseNumber: number, submissionId: number) =>
    `${baseURL}/${year}/${moduleCode}/exercises/${exerciseNumber}/submissions/${submissionId}`,
  submissionFile: (
    year: string,
    moduleCode: string,
    exerciseNumber: number,
    targetFileName: string,
    submissionId: number
  ) =>
    `${baseURL}/${year}/${moduleCode}/exercises/${exerciseNumber}/submissions/${submissionId}/file`,
  submissionWorkload: (year: string, moduleCode: string, exerciseNumber: number) =>
    `${baseURL}/${year}/${moduleCode}/exercises/${exerciseNumber}/workload`,
  resources: `${baseURL}/resources`,
  resource: (id: number) => `${baseURL}/resources/${id}`,
  resourceFile: (id: number) => `${baseURL}/resources/${id}/file`,
  resourcesArchive: `${baseURL}/resources/zipped`,
  periods: (year: string) => `${baseURL}/${year}/periods`,
}
