import React from 'react'
import '../styles/week-heading.css'

export interface WeekHeadingProps {
  weekNumber: number
  dateRangeStart: Date
  dateRangeEnd: Date
  activeDay: Date
}

function toDayCount(date: Date) {
  const milliSecInADay = 86400000
  return Math.floor(date.getTime() / milliSecInADay)
}

let days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']

const WeekHeading: React.FC<WeekHeadingProps> = ({ weekNumber, dateRangeStart, dateRangeEnd, activeDay }) => {
  return (
    <div className="weekCard">
      <div>
        <div className="weekHeading">Week {weekNumber}</div>
        <div className="weekDateRange">{formatDate(dateRangeStart, dateRangeEnd)}</div>
      </div>
      <div>
        {days.map((day, i) => {
          let isActive = toDayCount(dateRangeStart) + i === toDayCount(activeDay)
          return (
            <div key={day} className={isActive ? 'activeDay' : 'dayIndicator'}>
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default WeekHeading

function formatDate(dateRangeStart: Date, dateRangeEnd: Date) {
  const startMonth = new Intl.DateTimeFormat('en', {
    month: '2-digit',
  }).format(dateRangeStart)
  const startDay = new Intl.DateTimeFormat('en', {
    day: '2-digit',
  }).format(dateRangeStart)
  const endMonth = new Intl.DateTimeFormat('en', {
    month: '2-digit',
  }).format(dateRangeEnd)
  const endDay = new Intl.DateTimeFormat('en', {
    day: '2-digit',
  }).format(dateRangeEnd)
  return `${startDay}/${startMonth} - ${endDay}/${endMonth}`
}
