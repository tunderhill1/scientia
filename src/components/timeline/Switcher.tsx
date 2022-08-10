import { CloudDrizzleFill, EggFill, Rainbow, Snow, SunFill, TreeFill } from 'react-bootstrap-icons'

import { Wrapper } from '../../styles/_app.style'
import { Group, Item } from '../../styles/timeline/switcher.style'

/**
 * The timeline switcher houses a toggle group of six term and break toggles.
 * The switcher has two rows: the first houses the term toggles while the second houses the break toggles. Currently, we
 * hardcode the width of the switcher group to wrap the rows.
 *
 * NOTE: As always, there's some teminology. Terms and breaks are phases in an academic year. The individual terms or
 * breaks (e.g. autumn term or winter break) are specific periods in an academic year.
 */
const phases = {
  term: {
    autumn: <CloudDrizzleFill size={22} />,
    spring: <TreeFill size={22} />,
    summer: <SunFill size={22} />,
  },
  break: {
    winter: <Snow size={22} />,
    spring: <EggFill size={22} />,
    summer: <Rainbow size={22} />,
  },
}

export const Switcher = ({
  term,
  onSwitch,
}: {
  term: string
  onSwitch: (term: string) => void
}) => {
  const switcherGroupStyle = { maxWidth: '8.25rem', flexWrap: 'wrap' }
  const switcherWrapperStyle = {
    gridArea: 'switcher',
    top: 0,
    left: 0,
    position: 'sticky',
    zIndex: 5,
    background: '$appBackground',
    paddingTop: '1rem',
  }

  return (
    <Wrapper center css={switcherWrapperStyle}>
      <Group type="single" defaultValue={term} onValueChange={onSwitch} css={switcherGroupStyle}>
        {Object.entries(phases).map(([phase, periods]) =>
          Object.entries(periods).map(([period, icon]) => (
            <Item value={period + ' ' + phase} key={period}>
              {icon}
            </Item>
          ))
        )}
      </Group>
    </Wrapper>
  )
}
