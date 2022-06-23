import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { GroupedList } from '../components/GroupedList'
import { Tabs } from '../components/Tabs'
import { Toolbar } from '../components/Toolbar'
import { Caret } from '../styles/grouped-list.style'
import { Button } from '../styles/_app.style'
import { ToggleGroup, ToggleItem } from '../styles/toolbar.style'
import { ToolbarButton } from '@radix-ui/react-toolbar'
import { Check, CheckSquare, UiChecks, UiChecksGrid } from 'react-bootstrap-icons'

type CheckboxTable = { [key: string]: { [key: string]: boolean } }

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

export function defaultCheckboxTableForProperty(
  data: { [key: string]: object[] },
  property: string,
  defaultValue: boolean = false
): CheckboxTable {
  return Object.fromEntries(
    Object.entries(data).map(([header, list]: [string, object[]]) => {
      const table: { [key: string]: boolean } = list.reduce(
        (accTable: { [key: string]: boolean }, item: any) => ({
          ...accTable,
          [item[property]]: defaultValue,
        }),
        {}
      )
      return [header, table]
    })
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

  const [checkedItems, setCheckedItems] = useState(defaultCheckboxTableForProperty(data, 'title'))
  const [selectionMode, setSelectionMode] = useState(false)
  const [selectedAll, setSelectedAll] = useState(false)

  const onHeaderSelection = (header: string, checked: any) => {
    setCheckedItems({
      ...checkedItems,
      [header]: Object.fromEntries(Object.keys(checkedItems[header]).map((k) => [k, checked])),
    })
  }

  const onContentSelection = (header: string, groupItem: any, checked: any) => {
    setCheckedItems({
      ...checkedItems,
      [header]: { ...checkedItems[header], [groupItem.title]: checked },
    })
  }

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
            onClick={() => {
              setCheckedItems(defaultCheckboxTableForProperty(data, 'title', !selectedAll))
              setSelectedAll(!selectedAll)
            }}
          >
            {selectedAll ? 'Deselect all' : 'Select all'}
          </Button>
        )}
      </Toolbar>
      {loaded && (
        <GroupedList
          data={data}
          selectionMode={selectionMode}
          selectionTable={checkedItems}
          onHeaderSelection={onHeaderSelection}
          onContentSelection={onContentSelection}
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

/**
 * SCRATCH SPACE:
 *
 * > Expected Behaviour:
 *   -> We want to click on a category header to select all elements in the content
 *
 * > Consumer of GroupedList: defines check/uncheck callback
 *   -> pass the callback to the header generator AND the items generator, so that each checkbox triggers it
 *
 *  [GROUPED LIST]
 *   |-> [HEADER]  # Header has checkbox that when clicked would select all content
 *   |    |-> [USER GENERTOR]
 *   |-> [CONTENT]  # Each item in content has a checkbox that selects that item
 *        |-> [USER GENERATOR]
 *
 * Materials.tsx
 *
 * const [checkedValues, setCheckedValues] = useState<>()
 *
 * <GroupedList headerCallback={(header, group) => {K}}
 *              headerGenerator=({header, group} => <Header onClick={() => K} />)
 *              generator={(header, group) => <Checkbox value={checkedValues[header][ite]} onChecked={() => console.log("checked")}}
 *
 */
