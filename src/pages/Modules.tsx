import { Helmet } from 'react-helmet-async'
import { useNavigate, useParams } from 'react-router-dom'

import { Tabs } from '../components/Tabs'
import titles from '../constants/titles'
import { useUser } from '../lib/user.context'
import { Container } from '../styles/_app.style'
import { css } from '../styles/stitches.config'

const Modules = () => {
  const { userDetails } = useUser()
  const navigate = useNavigate()
  const { requestedYear: year } = useParams()

  return (
    <Container>
      <Helmet>
        <title>{titles.modules(year, userDetails?.cohortName)}</title>
      </Helmet>
      <section style={{ marginBottom: '2rem' }}>
        <h1>Modules</h1>
        <p>
          <b>Not seeing the modules you expect? Please try logging out and logging in again.</b>
        </p>
        <br />
        <p>
          These are the modules you are currently enrolled for. Click on any to access the relevant
          teaching materials and resources. A yellow dot indicates that a module's under
          construction and doesn't house any resources at the moment.
        </p>
      </section>

      <Tabs
        data={userDetails?.modules}
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
