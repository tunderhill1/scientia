import { useEffect } from 'react'
import { endpoints } from '../../constants/endpoints'
import { useAxios } from '../../lib/axios.context'
import { css } from '../../styles/stitches.config'
import { Wrapper } from '../../styles/_app.style'
import { Tabs } from '../Tabs'

const terms = {
  1: 'Autumn Term',
  2: 'Spring Term',
  3: 'Summer Term',
}

export const Modules = ({ term }: { term: string }) => {
  const { data } = useAxios({ url: endpoints.courses('2021'), method: 'GET' })

  useEffect(() => {
    console.log({ modules: data })
  }, [data])

  return (
    <Wrapper css={{ padding: '0.5rem' }}>
      <Tabs
        data={data}
        generator={(tab: any) => (
          <Wrapper css={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <span className={css({ color: '$lowContrast' })()}>{tab.code}</span>
            <span>{tab.title}</span>
          </Wrapper>
        )}
      />
    </Wrapper>
  )
}
