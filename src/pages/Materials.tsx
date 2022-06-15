import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { GroupedList } from '../components/GroupedList'
import { Tabs } from '../components/Tabs'
import { endpoints } from '../constants/endpoints'
import { useAxios } from '../lib/axios.context'
import { Caret } from '../styles/grouped-list.style'

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
  property: string
): { [key: string]: { [key: string]: boolean } } {
  return Object.fromEntries(
    Object.entries(data).map(([header, list]: [string, object[]]) => {
      const table: { [key: string]: boolean } = list.reduce(
        (accTable: { [key: string]: boolean }, item: any) => ({
          ...accTable,
          [item[property]]: false,
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

  return (
    <div
      style={
        data && Object.keys(data).length === 0
          ? { display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }
          : { width: '100%', marginTop: '1rem' }
      }
    >
      {loaded && (
        <GroupedList
          data={data}
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
