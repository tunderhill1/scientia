import { Accordion, Box, Caret, Content, Header, Item, Trigger } from '../styles/grouped-list.style'
import { Tabs } from './Tabs'

/* TODO: Remove dummy data once the grouped list accepts data */
export const groups = [
  {
    name: 'Group 1',
    resources: [
      { title: 'Resource 1' },
      { title: 'Resource 2' },
      { title: 'Resource 3' },
      { title: 'Resource 4' },
      { title: 'Resource 5' },
      { title: 'Resource 6' },
    ],
  },
  {
    name: 'Group 2',
    resources: [
      { title: 'Resource 1' },
      { title: 'Resource 2' },
      { title: 'Resource 3' },
      { title: 'Resource 4' },
      { title: 'Resource 5' },
      { title: 'Resource 6' },
      { title: 'Resource 7' },
      { title: 'Resource 8' },
      { title: 'Resource 9' },
      { title: 'Resource 10' },
      { title: 'Resource 11' },
      { title: 'Resource 12' },
    ],
  },
]

/**
 * TODO: We need to accept, as parameters, the group data, a generator function for the content box, along with misc.
 *       parameters (i.e. relevant attribute names and other preferences)
 */
export const GroupedList = ({
  data,
  headerKey = 'header',
  childrenKey = 'children',
}: {
  data: any
  headerKey?: string
  childrenKey?: string
}) => {
  return (
    <Accordion type="multiple">
      {
        /**
         * NOTE: We're iterating over the groups while creating an accordion toggle for each group with a tab list of
         *       resources contained in that group.
         * TODO: A minor issue exists because we're using the mouse to switch focus. Note that we do so to simulate the
         *       hover effect to avoid having two highlighted group triggers. The issue is that when a group is toggled
         *       and the cursor happens to be over another group's header, it switches focus to that group instead,
         *       which might throw off the user temporarily.
         */
        data &&
          data.map((group: any) => (
            <Item value={group[headerKey]} key={group[headerKey]}>
              {/* TODO: Allow user to specify unique identifier attribute instead */}
              <Header>
                <Trigger
                  /* TODO: It loses focus on sub-list interaction and hovering over the trigger doesn't recover it */
                  onMouseOver={(event) => {
                    event.currentTarget.focus()
                  }}
                >
                  <Caret style={{ marginRight: '0.5rem' }} />
                  {/* TODO: Allow user to specify attribute to use instead */}
                  <span>{group[headerKey]}</span>
                </Trigger>
              </Header>
              {/* TODO: Allow user to specify a way to calculate the max height */}
              <Content css={{ maxHeight: `calc(${group[childrenKey]?.length} * 2.75rem + 1rem)` }}>
                {/* TODO: Allow user to pass in styling overrides for this box */}
                <Box>
                  {/* TODO: Provide user with a generator function instead for modularity */}
                  <Tabs
                    data={group[childrenKey]}
                    generator={(tab: any) => <span>{tab.title}</span>}
                    onClick={() => {}}
                  />
                </Box>
              </Content>
            </Item>
          ))
      }
    </Accordion>
  )
}
