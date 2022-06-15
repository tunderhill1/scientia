import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { GroupedList } from '../components/GroupedList'
import { Tabs } from '../components/Tabs'
import { endpoints } from '../constants/endpoints'
import { useAxios } from '../lib/axios.context'

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

function groupByProperty(data: object[], property: string): { [key: string]: object[] } {
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

  return (
    <div
      style={
        data && Object.keys(data).length === 0
          ? { display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }
          : { width: '100%', marginTop: '1rem' }
      }
    >
      {loaded && <GroupedList data={data} />}
      {data && Object.keys(data).length === 0 && <span>No materials for this module.</span>}
    </div>
  )
}

export default Materials
