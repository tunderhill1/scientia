import { plainToInstance } from 'class-transformer'
import { useContext, useState } from 'react'
import { ChevronDoubleLeft, ChevronDoubleRight } from 'react-bootstrap-icons'
import { useNavigate, useParams } from 'react-router-dom'

import { endpoints } from '../constants/endpoints'
import { UserDetails } from '../constants/types'
import { AxiosContext } from '../lib/axios.context'
import { useToast } from '../lib/toast.context'
import { useUser } from '../lib/user.context'
import { formatShortYear, validShortYears } from '../lib/utilities.service'
import { YearArrow, YearSwitcherWrapper } from '../styles/navigation.style'

export const YearSwitcher = () => {
  const { requestedYear: year } = useParams()
  const navigate = useNavigate()
  const axiosInstance = useContext(AxiosContext)
  const { storeUserDetails } = useUser()
  const { addToast } = useToast()

  const years = validShortYears()
  const [yearIndex, setYearIndex] = useState(
    years.findIndex((validYear) => validYear === year) ?? years.length - 1
  )

  const changeYear = (offset: -1 | 1) => {
    setYearIndex((index) => {
      const newIndex =
        offset === -1 ? Math.max(index - 1, 0) : Math.min(index + 1, years.length - 1)
      const newYear = years[newIndex]
      axiosInstance
        .request({ method: 'GET', url: endpoints.personal(newYear) })
        .then(({ data }: { data: any }) => {
          if (!data?.length) throw new Error(`No user details found for ${newYear}`)
          storeUserDetails(plainToInstance(UserDetails, data[0]))
          navigate('/' + newYear + window.location.pathname.slice(5))
        })
        .catch((e: any) => {
          addToast({
            variant: 'error',
            title: `Sorry, you don't have any info for ${formatShortYear(newYear)}`,
          })
          console.error(e)
        })
      return newIndex
    })
  }

  return (
    <YearSwitcherWrapper>
      <YearArrow
        title="Previous academic year"
        onClick={() => changeYear(-1)}
        disabled={yearIndex <= 0}
      >
        <ChevronDoubleLeft size={20} />
      </YearArrow>
      <b>{formatShortYear(years[yearIndex])}</b>
      <YearArrow
        title="Next academic year"
        onClick={() => changeYear(+1)}
        disabled={yearIndex >= years.length - 1}
      >
        <ChevronDoubleRight size={20} />
      </YearArrow>
    </YearSwitcherWrapper>
  )
}
