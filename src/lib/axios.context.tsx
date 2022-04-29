import axios, { AxiosInstance, Method } from 'axios'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'
import useToken from './token.service'

/**
 * Code for the axios instance provider and the accompanying useAxios hook was sourced (and modified) from the following
 * blog post by Arek Nawo:
 * https://blog.openreplay.com/integrating-axios-with-react-hooks
 *
 * NOTE: Currently, the context only supports one instance for the Materials API. The functionality would have to be
 * modified to support the eMarking and ABC APIs in the future
 *
 * Request and response interceptors:
 * 1. The request interceptor is used to attach the authorization header if the user's logged in
 * 2. The response interceptor should catch a 401, refresh the tokens and retry the original request
 *
 * TODO: Implement functionality; currently, they're dummy interceptors
 */

const AxiosContext = createContext<AxiosInstance>(axios)

/* TODO: Support multiple instances with additional configurations; i.e. create a ref for each instance */
export const AxiosInstanceProvider = ({ config = {}, children }: { config: any; children: React.ReactNode }) => {
  const instanceRef = useRef(axios.create(config))
  const { getToken } = useToken()

  /* NOTE: I think the interceptors would be added on each refresh? But does the reference last? */
  instanceRef.current.interceptors.request.use((request) => {
    console.log('Request logged.')
    /* TODO: Need to check if the user's logged in before adding the token */
    request.headers = { Authorization: `Bearer ${getToken('access')}` }
    return request
  })

  instanceRef.current.interceptors.response.use(
    (response) => {
      console.log('Response logged.')
      return response
    },
    (error) => {
      console.log('Error on response logged.')
      return Promise.reject(error)
    }
  )

  return <AxiosContext.Provider value={instanceRef.current}>{children}</AxiosContext.Provider>
}

/* The following hook allows use of the axios instance from any functional component */
export const useAxios = (url: string, method: Method, payload: any = null) => {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)

  const instance = useContext(AxiosContext)
  const controllerRef = useRef(new AbortController())

  const cancel = () => {
    controllerRef.current.abort()
  }

  useEffect(() => {
    ;(async () => {
      try {
        const response = await instance.request({
          signal: controllerRef.current.signal,
          data: payload,
          method,
          url,
        })

        setData(response.data)
      } catch (e: unknown) {
        if (e instanceof Error) setError(e.message)
      } finally {
        setLoaded(true)
      }
    })()
  }, [instance, method, payload, url])

  return { cancel, data, error, loaded }
}
