import * as Accordion from '@radix-ui/react-accordion'
import { css } from '../styles/stitches.config'
import { Tabs } from './Tabs'

const data = [
  {
    name: 'Category 1',
    resources: [{ title: 'Resource 1' }, { title: 'Resource 2' }, { title: 'Resource 3' }],
  },
  {
    name: 'Category 2',
    resources: [{ title: 'Resource 1' }, { title: 'Resource 2' }],
  },
]

export const GroupedList = () => {
  return (
    <>
      <Accordion.Root type="single" collapsible>
        {data &&
          data.map((category: any) => (
            <Accordion.Item value={category.name}>
              <Accordion.Header>
                <Accordion.Trigger>
                  <span>{category.name}</span>
                </Accordion.Trigger>
              </Accordion.Header>
              <Accordion.Content>
                <Tabs data={category.resources} generator={(tab: any) => <span>{tab.title}</span>} onClick={() => {}} />
              </Accordion.Content>
            </Accordion.Item>
          ))}
      </Accordion.Root>
      {/* iterate through the data, and for each category create an accordion, and for each resource, a tab */}
    </>
  )
}
