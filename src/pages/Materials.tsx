import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { GroupedList } from '../components/GroupedList'
import { Tabs } from '../components/Tabs'
import { Toolbar } from '../components/Toolbar'
import { Caret } from '../styles/grouped-list.style'
import { Button } from '../styles/_app.style'
import { ToggleGroup, ToggleItem } from '../styles/toolbar.style'
import { ToolbarButton } from '@radix-ui/react-toolbar'
import { UiChecks } from 'react-bootstrap-icons'
import useChecklist from '../lib/checkbox.service'

const materials = [
  {
    category: 'Lecture Notes',
    title: 'Haskell Notes Week 1',
    other: '...other stuff...',
  },
  {
    category: 'Lecture Notes',
    title: 'Haskell Notes Week 2',
    other: '...other stuff...',
  },
  {
    category: 'Lecture Notes',
    title: 'Haskell Notes Week 3',
    other: '...other stuff...',
  },
  {
    category: 'Unassessed Courseworks',
    title: 'Unassessed 1',
    other: '...other stuff...',
  },
]

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

  const data = groupByProperty(materials, 'category')
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
          <Button
            css={{ marginTop: 0, maxWidth: '9rem', padding: '0.5rem', marginLeft: 'auto' }}
            as={ToolbarButton}
            onClick={checklistManager.onToggle}
          >
            {checklistManager.getGlobalState() === true ? 'Deselect all' : 'Select all'}
          </Button>
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
