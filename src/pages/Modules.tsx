import { Tabs } from '../components/Tabs'
import { endpoints } from '../constants/endpoints'
import { useAxios } from '../lib/axios.context'
import { css } from '../styles/stitches.config'
import { Container } from '../styles/_app.style'

const Modules = () => {
  const { data } = useAxios(endpoints.courses('2021'), 'GET')

  return (
    <Container>
      <section style={{ marginBottom: '2rem' }}>
        <h1>Modules</h1>
        <p>
          These are the modules you are currently enrolled for. Click on any to access the relevant teaching materials
          and resources. A yellow dot indicates that a module's under construction and doesn't house any resources at
          the moment.
        </p>
      </section>

      <Tabs
        data={data}
        generator={(tab: any) => (
          <>
            {/* TODO: Update title style if module has no resources */}
            <span>{tab.title}</span>
            <span className={css({ color: '$lowContrast' })()}>{tab.code}</span>
          </>
        )}
      />
    </Container>
  )
}

export default Modules
