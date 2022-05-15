import { useNavigate } from 'react-router-dom'
import { Tabs } from '../components/Tabs'
import { endpoints } from '../constants/endpoints'
import { useAxios } from '../lib/axios.context'
import { css } from '../styles/stitches.config'
import { Container } from '../styles/_app.style'

const Modules = () => {
  const { data } = useAxios(endpoints.courses('2021'), 'GET')
  const navigate = useNavigate()

  /**
   * TODO: Memoise the data into local storage or into a context so that you don't have to hit the endpoint again to
   * retrieve the module name?
   */
  if (data !== null) {
    window.localStorage.setItem('modules', JSON.stringify(data))
  }

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
        onClick={(tab: any) => navigate(`${tab.code}`)}
      />
    </Container>
  )
}

export default Modules
