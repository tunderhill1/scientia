import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { Tabs } from '../components/Tabs'
import { endpoints } from '../constants/endpoints'
import { useAxios } from '../lib/axios.context'

const Materials = () => {
  const moduleCode = useOutletContext<string | null>()
  const { data, loaded } = useAxios({
    url: endpoints.resources,
    method: 'GET',
    params: { year: '2021', course: moduleCode },
  })

  useEffect(() => {
    if (data !== null) {
      console.log(data)
    }
  }, [data])

  return (
    <div
      style={
        data && data.length === 0
          ? { display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center' }
          : { width: '100%', marginTop: '1rem' }
      }
    >
      {loaded && (
        <Tabs data={data} generator={(tab: any) => <span>{tab.title}</span>} onClick={() => {}} identifier="id" />
      )}
      {data && data.length === 0 && <span>No materials for this module.</span>}
    </div>
  )
}

export default Materials
