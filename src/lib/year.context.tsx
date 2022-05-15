import React, { createContext, useContext, useEffect, useState } from 'react'
import { years } from '../constants/years'
type YearProviderType = { year: number; changeYear: (year: number) => boolean }

const defaultYear = {
  year: 0,
  changeYear: (_: number) => false,
}

const YearContext = createContext<YearProviderType>(defaultYear)

export const YearProvider = ({ current, children }: { current: number; children: React.ReactNode }) => {
  const [year, setYear] = useState(defaultYear.year)

  useEffect(() => {
    const storedYear = window.localStorage.getItem('year')
    if (storedYear) setYear(parseInt(storedYear))
    else {
      setYear(current)
      window.localStorage.setItem('year', current.toString())
    }
  }, [current])

  const changeYear = (year: number) => {
    if (!years.includes(year)) return false
    setYear(year)
    window.localStorage.setItem('year', year.toString())
    return true
  }

  return <YearContext.Provider value={{ year, changeYear }}>{children}</YearContext.Provider>
}

/* Allow year information to be accessed and changed in any functional component using the following hook: */
export const useYear = () => useContext(YearContext)
