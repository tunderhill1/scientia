import { useState } from 'react'
import { Check, Dash, Download, UiChecks } from 'react-bootstrap-icons'
import { useOutletContext } from 'react-router-dom'
import { GroupedList } from '../components/GroupedList'
import { Tabs } from '../components/Tabs'
import { Toolbar } from '../components/Toolbar'
import { mockMaterials } from '../constants/mock'
import useChecklist from '../lib/checkbox.service'
import { Caret } from '../styles/grouped-list.style'
import { Checkbox, Indicator } from '../styles/login.style'
import { ToggleGroup, ToggleItem } from '../styles/toolbar.style'
import { Button } from '../styles/_app.style'

export function groupByProperty(data: object[], property: string): { [key: string]: object[] } {
  return data.reduce(
    (groups: any, item: any) => ({
      ...groups,
      [item[property]]: [...(groups[item[property]] || []), item],
    }),
    {}
  )
}

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

  return (
    <div
      style={
        data && Object.keys(data).length === 0
          ? { display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }
          : { width: '100%', marginTop: '1rem' }
      }
    >
      <Toolbar style={{ marginBottom: '1rem' }}>
        <ToggleGroup type="single">
          <ToggleItem value="select" onClick={(event) => setSelectionMode(!selectionMode)}>
            <UiChecks size={22} />
          </ToggleItem>
        </ToggleGroup>
        {selectionMode && (
          <>
            <Button icon css={{ marginLeft: 'auto' }}>
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
      {data && Object.keys(data).length === 0 && <span>No materials for this module.</span>}
    </div>
  )
}

export default Materials
