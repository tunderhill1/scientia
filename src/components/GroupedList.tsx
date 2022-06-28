import { Accordion, Box, Content, Header, Item, Trigger } from '../styles/grouped-list.style'
import { ReactNode } from 'react'
import { Checkbox, Indicator } from '../styles/login.style'
import { Check, Dash } from 'react-bootstrap-icons'

/**
 * TODO: We need to accept, as parameters, the group data, a generator function for the content box, along with misc.
 *       parameters (i.e. relevant attribute names and other preferences)
 */

export const GroupedList = ({
  data,
  contentGenerator,
  headerGenerator,
  selectionMode = false,
  checklistManager = {},
}: {
  data: { [key: string]: object[] }
  contentGenerator: (header: string, group: object[]) => ReactNode
  headerGenerator: (header: string, group: object[]) => ReactNode
  selectionMode?: boolean
  checklistManager?: any
}) => {
  return (
    <Accordion type="multiple" defaultValue={Object.keys(data)}>
      {
        /**
         * NOTE: We're iterating over the groups while creating
         * an accordion toggle for each group with a tab list of
         * resources contained in that group.
         */
        data &&
          Object.entries(data).map(([header, group]) => {
            return (
              <Item value={header} key={header}>
                {/* TODO: Allow user to specify unique identifier attribute instead */}
                <Header>
                  <Trigger>{headerGenerator(header, group)}</Trigger>
                  {selectionMode && (
                    <Checkbox
                      css={{ minWidth: '1.75rem' }}
                      checked={
                        checklistManager.isIndeterminate(header) ? 'indeterminate' : checklistManager.isComplete(header)
                      }
                      onCheckedChange={(checked) => checklistManager.onCollectionCheck(header, checked)}
                    >
                      <Indicator>{checklistManager.isIndeterminate(header) ? <Dash /> : <Check />}</Indicator>
                    </Checkbox>
                  )}
                </Header>
                {/* TODO: Allow user to specify a way to calculate the max height */}
                <Content css={{ maxHeight: `calc(${group?.length} * 2.75rem + 1rem)` }}>
                  {/* TODO: Allow user to pass in styling overrides for this box */}
                  <Box>{contentGenerator(header, group)}</Box>
                  {selectionMode && (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'space-evenly',
                        minWidth: '1.75rem',
                        minHeight: '100%',
                      }}
                    >
                      {group.map((groupItem: any) => {
                        return (
                          <Checkbox
                            checked={checklistManager.getItemState(header, groupItem.title)}
                            onCheckedChange={(checked) =>
                              checklistManager.onItemCheck(header, groupItem.title, checked)
                            }
                            key={groupItem.title} // TODO: use id
                          >
                            <Indicator>
                              <Check />
                            </Indicator>
                          </Checkbox>
                        )
                      })}
                    </div>
                  )}
                </Content>
              </Item>
            )
          })
      }
    </Accordion>
  )
}
