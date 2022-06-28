import { useEffect, useState } from 'react'
import { Check, Dash, Download, UiChecks } from 'react-bootstrap-icons'
import { useOutletContext } from 'react-router-dom'
import { GroupedList } from '../components/GroupedList'
import { Tabs } from '../components/Tabs'
import { Toolbar } from '../components/Toolbar'
import { endpoints } from '../constants/endpoints'
import { useAxios } from '../lib/axios.context'
import useChecklist from '../lib/checkbox.service'
import { groupByProperty } from '../lib/utilities.service'
import { useYear } from '../lib/year.context'
import { Caret } from '../styles/grouped-list.style'
import { Checkbox, Indicator } from '../styles/login.style'
import { ToggleGroup, ToggleItem } from '../styles/toolbar.style'
import { Button, Footnote, Wrapper } from '../styles/_app.style'

const Materials = () => {
  const [selectionMode, setSelectionMode] = useState(false)
  const [groupedMaterials, setGroupedMaterials] = useState({})

  const moduleCode = useOutletContext<string | null>()
  const { year } = useYear()
  const checklistManager = useChecklist(groupedMaterials, 'title', false)
  const { data, loaded } = useAxios({
    url: endpoints.resources,
    method: 'GET',
    params: { year: year, course: moduleCode },
  })

  const noMaterials = () => groupedMaterials && Object.keys(groupedMaterials).length === 0

  useEffect(() => {
    if (data !== null) setGroupedMaterials(groupByProperty(data, 'category'))
  }, [data])

  if (noMaterials())
    return (
      <Wrapper center>
        <span>No materials for this module.</span>
      </Wrapper>
    )

  return (
    <Wrapper>
      <Toolbar style={{ marginBottom: '1rem' }}>
        <ToggleGroup type="single">
          <ToggleItem value="select" onClick={(event) => setSelectionMode(!selectionMode)}>
            <UiChecks size={22} />
          </ToggleItem>
        </ToggleGroup>
        {selectionMode && (
          <>
            <Button icon css={{ marginLeft: 'auto', marginRight: '0.75rem' }}>
              <Download size={22} />
            </Button>
            <Checkbox
              css={{ marginTop: '0.5rem' }}
              checked={checklistManager.getCheckedState()}
              onCheckedChange={checklistManager.onToggle}
            >
              <Indicator>{checklistManager.getCheckedState() === 'indeterminate' ? <Dash /> : <Check />}</Indicator>
            </Checkbox>
          </>
        )}
      </Toolbar>
      {loaded && (
        <GroupedList
          data={groupedMaterials}
          selectionMode={selectionMode}
          checklistManager={checklistManager}
          headerGenerator={(header, _) => (
            <>
              <Caret />
              <span>{header}</span>
            </>
          )}
          contentGenerator={(_, group) => <Tabs data={group} generator={(tab: any) => <span>{tab.title}</span>} />}
        />
      )}
      <Footnote muted center css={{ margin: '2rem 0' }}>
        Please contact the relevant module leader(s) for missing resources or if you'd like materials to be better
        organised; we recommend using EdStem to help them gauge the peer response.
      </Footnote>
    </Wrapper>
  )
}

export default Materials
