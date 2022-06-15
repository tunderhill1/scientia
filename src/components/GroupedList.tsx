import { Accordion, Box, Content, Header, Item, Trigger } from '../styles/grouped-list.style'
import { ReactNode } from 'react'

/**
 * TODO: We need to accept, as parameters, the group data, a generator function for the content box, along with misc.
 *       parameters (i.e. relevant attribute names and other preferences)
 */

export const GroupedList = ({
  data,
  contentGenerator,
  headerGenerator,
}: {
  data: { [key: string]: object[] }
  contentGenerator: (header: string, group: object[]) => ReactNode
  headerGenerator: (header: string, group: object[]) => {}
}) => {
  return (
    <Accordion type="multiple" defaultValue={Object.keys(data)}>
      {
        /**
         * NOTE: We're iterating over the groups while creating an accordion toggle for each group with a tab list of
         *       resources contained in that group.
         */
        data &&
          Object.entries(data).map(([header, group]) => (
            <Item value={header} key={header}>
              {/* TODO: Allow user to specify unique identifier attribute instead */}
              <Header asChild>
                <Trigger>{headerGenerator(header, group)}</Trigger>
              </Header>
              {/* TODO: Allow user to specify a way to calculate the max height */}
              <Content css={{ maxHeight: `calc(${group?.length} * 2.75rem + 1rem)` }}>
                {/* TODO: Allow user to pass in styling overrides for this box */}
                <Box>{contentGenerator(header, group)}</Box>
              </Content>
            </Item>
          ))
      }
    </Accordion>
  )
}
