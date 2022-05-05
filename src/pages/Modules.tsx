import { useContext } from 'react'
import { Tabs } from '../components/Tabs'
import { endpoints } from '../constants/endpoints'
import useAuth from '../lib/auth.service'
import { useAxios } from '../lib/axios.context'
import { ThemeContext } from '../lib/theme.context'
import { Button, Container } from '../styles/_app.style'

const ToggleTheme = () => {
  const { theme, toggleTheme } = useContext(ThemeContext)
  return <Button onClick={toggleTheme}>Mode: {theme}</Button>
}

const Modules = () => {
  const { logoutUser } = useAuth()
  const { data } = useAxios(endpoints.courses('2021'), 'GET')

  return (
    <Container>
      <section style={{ marginBottom: '0.5rem' }}>
        <h1 style={{ marginBottom: '1rem', fontWeight: '600', letterSpacing: '-0.5' }}>Modules</h1>
        <p style={{ marginBottom: '1rem' }}>
          These are the modules you are currently enrolled for. Click on any to access the relevant teaching materials
          and resources. A yellow dot indicates that a module's under construction and doesn't house any resources at
          the moment.
        </p>
      </section>

      <Tabs
        data={data}
        generator={(tab: any) => (
          <>
            <span>{tab.title}</span>
            <span>{tab.code}</span>
          </>
        )}
      />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '1rem' }}>
        <ToggleTheme />
        <Button
          onClick={() => {
            logoutUser()
          }}
        >
          Logout
        </Button>
      </div>
    </Container>
  )
}

export default Modules
