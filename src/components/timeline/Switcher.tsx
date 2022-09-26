import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'react-bootstrap-icons'

import { Term } from '../../constants/types'
import { groupByProperty } from '../../lib/utilities.service'
import { SwitcherWrapper, TermSwitchArrow } from '../../styles/timeline/switcher.style'
import { SelectBox } from '../Select'

export const Switcher = ({
  term,
  setTerm,
  terms,
}: {
  term: string
  setTerm: (_: Term) => void
  terms: Term[]
}) => {
  const periods = Object.keys(groupByProperty(terms, 'name', 'start'))
  const [periodIndex, setPeriodIndex] = useState(periods.findIndex((p) => p === term))

  useEffect(() => {
    setTerm(terms.find((term) => term.name === periods[periodIndex]) || terms[0])
  }, [periodIndex, periods, setTerm, terms])

  return (
    <SwitcherWrapper>
      <TermSwitchArrow
        title="Previous academic period"
        onClick={() => setPeriodIndex((index) => Math.max(index - 1, 0))}
        disabled={periodIndex <= 0}
      >
        <ChevronLeft size={20} />
      </TermSwitchArrow>

      <SelectBox
        title="academic_period"
        items={periods}
        display={(p) =>
          p
            .split(' ')
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ')
        }
        defaultValue={periodIndex.toString()}
        onSelect={(newIndex) => setPeriodIndex(parseInt(newIndex))}
        value={periodIndex.toString()}
      />

      <TermSwitchArrow
        title="Next academic period"
        onClick={() => setPeriodIndex((index) => Math.min(index + 1, periods.length - 1))}
        disabled={periodIndex >= periods.length - 1}
      >
        <ChevronRight size={20} />
      </TermSwitchArrow>
    </SwitcherWrapper>
  )
}
