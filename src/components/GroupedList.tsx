import { Accordion, Box, Content, Header, Item, Trigger } from '../styles/grouped-list.style'
import { ReactNode } from 'react'
import { Checkbox, Indicator } from '../styles/login.style'
import { CheckboxIndicator } from '@radix-ui/react-checkbox'
import { Check } from 'react-bootstrap-icons'

/**
 * TODO: We need to accept, as parameters, the group data, a generator function for the content box, along with misc.
 *       parameters (i.e. relevant attribute names and other preferences)
 */

export const GroupedList = ({
  data,
  selectionMode = false,
  selectionTable = {},
  onHeaderSelection = (header, checked) => {},
  onContentSelection = (header, group, checked) => {},
  contentGenerator,
  headerGenerator,
}: {
  data: { [key: string]: object[] }
  selectionMode?: boolean
  selectionTable?: { [key: string]: { [key: string]: boolean } }
  onHeaderSelection?: (header: string, checked: any) => void
  onContentSelection?: (header: string, group: string, checked: any) => void
  contentGenerator: (header: string, group: object[]) => ReactNode
  headerGenerator: (header: string, group: object[]) => ReactNode
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
              <Header>
                {/* MARK: Checkbox here! */}
                {selectionMode && (
                  <Checkbox
                    checked={Object.values(selectionTable[header]).every((checked) => checked)}
                    onCheckedChange={(checked) => onHeaderSelection(header, checked)}
                    id={`${header}-checkbox`}
                  >
                    <Indicator>
                      <Check />
                    </Indicator>
                  </Checkbox>
                )}
                <Trigger
                  /* TODO: It loses focus on sub-list interaction and hovering over the trigger doesn't recover it */
                  onMouseOver={(event) => {
                    event.currentTarget.focus()
                  }}
                >
                  {headerGenerator(header, group)}
                </Trigger>
              </Header>
              {/* TODO: Allow user to specify a way to calculate the max height */}
              <Content css={{ maxHeight: `calc(${group?.length} * 2.75rem + 1rem)` }}>
                {/* TODO: Allow user to pass in styling overrides for this box */}
                <Box>{contentGenerator(header, group)}</Box>
                {/* MARK: Checkbox generator here! */}
                <div style={{ backgroundColor: 'red', flexGrow: '2', minWidth: '2.75rem', minHeight: '100%' }} />
              </Content>
            </Item>
          ))
      }
    </Accordion>
  )
}
