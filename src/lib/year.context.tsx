import { ReactNode, createContext, useContext, useEffect, useState } from 'react'

import { years } from '../constants/years'
import { currentShortYear } from './utilities.service'

type YearProviderType = { year: string; changeYear: (year: string) => boolean }

const defaultYear = {
  year: currentShortYear(),
  changeYear: (_: string) => false,
}

const YearContext = createContext<YearProviderType>(defaultYear)

export const YearProvider = ({ current, children }: { current: string; children: ReactNode }) => {
  const [year, setYear] = useState(defaultYear.year)

  let storedYear = window.localStorage.getItem('year')
  if (storedYear === '') {
    storedYear = current
    window.localStorage.setItem('year', storedYear)
  }

  useEffect(() => {
    if (storedYear !== null) setYear(storedYear)
  }, [storedYear])

  const changeYear = (year: string) => {
    if (!years.includes(year)) return false
    setYear(year)
    window.localStorage.setItem('year', year)
    return true
  }

  return <YearContext.Provider value={{ year, changeYear }}>{children}</YearContext.Provider>
}

/* Allow year information to be accessed and changed in any functional component using the following hook: */
export const useYear = () => useContext(YearContext)
