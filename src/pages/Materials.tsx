import { useState } from 'react'
import { Check, Dash, Download, UiChecks } from 'react-bootstrap-icons'
import { useOutletContext } from 'react-router-dom'
import { GroupedList } from '../components/GroupedList'
import { Tabs } from '../components/Tabs'
import { Toolbar } from '../components/Toolbar'
import { mockMaterials } from '../constants/mock'
import useChecklist from '../lib/checkbox.service'
import { groupByProperty } from '../lib/utilities.service'
import { Caret } from '../styles/grouped-list.style'
import { Checkbox, Indicator } from '../styles/login.style'
import { ToggleGroup, ToggleItem } from '../styles/toolbar.style'
import { Button, Footnote, Wrapper } from '../styles/_app.style'

const Materials = () => {
  const moduleCode = useOutletContext<string | null>()
  // const { data, loaded } = useAxios({
  //   url: endpoints.resources,
  //   method: 'GET',
  //   params: { year: '2021', course: moduleCode },
  // })

  // useEffect(() => {
  //   if (data !== null) {
  //     console.log(data)
  //   }
  // }, [data])

  const data = groupByProperty(mockMaterials, 'category')
  const loaded = true

  const checklistManager = useChecklist(data, 'title', false)
  const [selectionMode, setSelectionMode] = useState(false)

  const noMaterials = () => data && Object.keys(data).length === 0

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
              checked={checklistManager.checkedState}
              onCheckedChange={checklistManager.onToggle}
            >
              <Indicator>{checklistManager.checkedState === 'indeterminate' ? <Dash /> : <Check />}</Indicator>
            </Checkbox>
          </>
        )}
      </Toolbar>
      {loaded && (
        <GroupedList
          data={data}
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
