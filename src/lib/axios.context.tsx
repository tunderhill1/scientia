import axios, { AxiosInstance, Method } from 'axios'
import { plainToInstance } from 'class-transformer'
import qs from 'qs'
import React, { createContext, useContext, useEffect, useRef, useState } from 'react'

import { endpoints } from '../constants/endpoints'
import { UserDetails } from '../constants/types'
import useAuth from './auth.service'
import { useUser } from './user.context'

export const CSRF_ACCESS_COOKIE = 'csrf_access_token'
export const CSRF_REFRESH_COOKIE = 'csrf_refresh_token'

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
 *
 */

export function getCookie(cookieName: string): string {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${cookieName}=`)
  return parts.length === 2 ? parts.pop()?.split(';').shift() || '' : ''
}

export const AxiosContext = createContext<AxiosInstance>(axios)

/* TODO: Support multiple instances with additional configurations; i.e. create a ref for each instance */
export const AxiosInstanceProvider = ({
  config = {},
  children,
}: {
  config: any
  children: React.ReactNode
}) => {
  const instanceRef = useRef<AxiosInstance | null>(null)
  const { storeUserDetails } = useUser()
  const { logoutUser } = useAuth()

  function refreshAccessToken() {
    return axios({
      method: 'post',
      headers: { 'X-CSRF-TOKEN': getCookie(CSRF_REFRESH_COOKIE) },
      url: endpoints.refresh,
    })
      .then((response) => {
        storeUserDetails(plainToInstance(UserDetails, response.data))
      })
      .catch((_) => {
        logoutUser()
      })
  }

  /* NOTE: See https://beta.reactjs.org/apis/useref#avoiding-recreating-the-ref-contents */
  if (instanceRef.current === null) {
    /* Setup instance and interceptors */
    let axiosInstance = axios.create(config)
    axiosInstance.interceptors.request.use((request) => {
      /* TODO: Need to check if the user's logged in before adding the token */
      request.headers = { 'X-CSRF-TOKEN': getCookie(CSRF_ACCESS_COOKIE) }
      request.withCredentials = true
      request.paramsSerializer = (params) => qs.stringify(params, { indices: false })

      return request
    })
    axiosInstance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        if (
          (error.response.status === 401 ||
            (error.response.status === 422 &&
              error.response.data?.detail === 'Signature has expired')) &&
          !originalRequest._retry
        ) {
          originalRequest._retry = true
          await refreshAccessToken()
          return axiosInstance(originalRequest)
        }
        return Promise.reject(error)
      }
    )
    instanceRef.current = axiosInstance
  }

  /* NOTE: I think the interceptors would be added on each refresh? But does the reference last? */
  return <AxiosContext.Provider value={instanceRef.current}>{children}</AxiosContext.Provider>
}
