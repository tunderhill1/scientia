import React from 'react'
import ReactDOM from 'react-dom'
import './styles/raster.grid.css'
import App from './pages/_app'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import axios from 'axios'

/**
 * Request and response interceptors:
 * 1. The request interceptor is used to attach the authorization header if the user's logged in
 * 2. The response interceptor should catch a 401, refresh the tokens and retry the original request
 *
 * TODO: Implement functionality; currently, they're dummy interceptors
 */
axios.interceptors.request.use((request) => {
  console.log('Request logged.')
  return request
})

axios.interceptors.response.use(
  (response) => {
    console.log('Response logged.')
    return response
  },
  (error) => {
    console.log('Error on response logged.')
    return Promise.reject(error)
  }
)

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
