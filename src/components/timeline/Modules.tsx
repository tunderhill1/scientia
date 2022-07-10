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

export const Modules = ({ term, rowHeights }: { term: string; rowHeights: { [code: string]: string } }) => {
  const { data } = useAxios({ url: endpoints.courses('2122'), method: 'GET' })
  const modulesWrapperStyle = {
    gridArea: 'modules',

    display: 'grid',
    gridGap: '0.5rem',

    padding: '0.5rem',
    paddingBottom: '1rem',
    position: 'sticky',
    left: '0',

    zIndex: '4',
    backgroundColor: '$appBackground',
  }

  return (
    <Wrapper css={modulesWrapperStyle}>
      <Tabs
        data={data}
        generator={(module: any) => (
          <Wrapper
            css={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              height: rowHeights[module.code] ?? '3.25rem',
              /* TODO: Extract constants */
              width: 'calc(16.875rem - 2rem)',
            }}
          >
            <span className={css({ color: '$lowContrast' })()}>{module.code}</span>
            <span
              /* TODO: Extract styling */
              className={css({
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                minWidth: '0',
                overflow: 'hidden',
                marginRight: '0.5rem',
              })()}
            >
              {module.title}
            </span>
          </Wrapper>
        )}
      />
    </Wrapper>
  )
}
