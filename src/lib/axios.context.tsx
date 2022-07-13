import axios, { AxiosInstance, Method } from 'axios'
import qs from 'qs'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

import useAuth from './auth.service'

export const ANTI_CSRF_COOKIE_NAME = 'csrf_access_token'

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

export function getCookie(cookieName: string): string {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${cookieName}=`)
  return parts.length === 2 ? parts.pop()?.split(';').shift() || '' : ''
}

export const AxiosContext = createContext<AxiosInstance>(axios)

/* TODO: Support multiple instances with additional configurations; i.e. create a ref for each instance */
export const AxiosInstanceProvider = ({ config = {}, children }: { config: any; children: React.ReactNode }) => {
  const instanceRef = useRef<AxiosInstance | null>(null)
  const { logoutUser } = useAuth()

  /* NOTE: See https://beta.reactjs.org/apis/useref#avoiding-recreating-the-ref-contents */
  if (instanceRef.current === null) {
    /* Setup instance and interceptors */
    instanceRef.current = axios.create(config)
    instanceRef.current.interceptors.request.use((request) => {
      /* TODO: Need to check if the user's logged in before adding the token */
      request.headers = { 'X-CSRF-TOKEN': getCookie(ANTI_CSRF_COOKIE_NAME) }
      request.withCredentials = true
      request.paramsSerializer = (params) => {
        return qs.stringify(params, { indices: false })
      }
      return request
    })
    instanceRef.current.interceptors.response.use(
      (response) => {
        return response
      },
      async (error) => {
        if ([401, 422].includes(error.response.status)) logoutUser()
        return Promise.reject(error)
      }
    )
  }

  /* NOTE: I think the interceptors would be added on each refresh? But does the reference last? */
  return <AxiosContext.Provider value={instanceRef.current}>{children}</AxiosContext.Provider>
}

/**
 * The following hook allows use of the axios instance from any functional component
 * NOTE: It assumes that the config passed in doesn't change on a re-render!
 */
export const useAxios = (config: { url: string; method: Method; payload?: any; params?: any }) => {
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')
  const [loaded, setLoaded] = useState(false)

  const instance = useContext(AxiosContext)
  const controllerRef = useRef<AbortController | null>(null)
  const configRef = useRef(config)

  /* NOTE: See https://beta.reactjs.org/apis/useref#avoiding-recreating-the-ref-contents */
  if (controllerRef.current === null) {
    controllerRef.current = new AbortController()
  }

  const cancel = () => {
    controllerRef.current?.abort()
  }

  /**
   * NOTE: It's crucial to understand how useEffect works to reason out why we don't use the config prop directly. On a
   * re-render, useEffect only runs the callback when any of the listed dependencies change. This change is detected
   * through a referential equality check between values at the previous and current render. That is, if prev ===
   * current, then don't run the callback; else run it. For objects (like config) where the structure is unknown (i.e.
   * payload and params), this check fails. Options:
   * 1. Implement a wrapper around useEffect that would use a deep comparison (e.g. lodash.isequal).
   * 2. Create a temporary dependency that's initialized to JSON.stringify(config) and parse this using JSON.parse(...)
   *    inside the useEffect. This is OK if the object is shallow (lightweight).
   * 3. The third option is to wrap the config in a ref and use this instead as a dependency. We know that the config
   *    isn't going to change on a re-render. Refs guarantee the same object on a re-render.
   *    See https://beta.reactjs.org/apis/useref
   */
  useEffect(() => {
    const request = async () => {
      try {
        const response = await instance.request({
          signal: controllerRef.current?.signal,
          data: configRef.current.payload,
          params: configRef.current.params,
          method: configRef.current.method,
          url: configRef.current.url,
        })
        setData(response.data)
      } catch (e: unknown) {
        if (e instanceof Error) setError(e.message)
      } finally {
        setLoaded(true)
      }
    }

    request()
  }, [instance])

  return { cancel, data, error, loaded }
}
