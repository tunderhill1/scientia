import { format } from 'date-fns'
import { utcToZonedTime } from 'date-fns-tz'
import { useContext, useEffect, useState } from 'react'
import { InfoCircle } from 'react-bootstrap-icons'
import Creatable from 'react-select/creatable'

import { LONDON_TIMEZONE } from '../../../../constants/global'
import { ResourceCreate } from '../../../../constants/types'
import { getUTCDatetime } from '../../../../lib/resource.service'
import { ThemeContext } from '../../../../lib/theme.context'
import { useToast } from '../../../../lib/toast.context'
import { displayTimestamp } from '../../../../lib/utilities.service'
import {
  ApplyToAllButton,
  CalendarInput,
  DropdownStyle,
  Label,
  NowButton,
  TimeInput,
  TitleInput,
  Visibility,
} from '../../../../styles/resource-details-form.style'

// maximum height of dropdown menu before scrolling
// https://react-select.com/props#creatable-props (see maxMenuHeight)
const MAX_OPTIONS_MENU_HEIGHT = 130

const ResourceDetailsForm = ({
  resource,
  onResourceChange,
  categoryOptions,
  setCategoryOptions,
  setForAllResources,
}: {
  resource: ResourceCreate
  onResourceChange: (key: string, value: any) => void
  categoryOptions: { value: string; label: string }[]
  setCategoryOptions: any
  setForAllResources?: (key: string, value: any) => void
}) => {
  const { addToast } = useToast()
  const { theme } = useContext(ThemeContext)
  const [title, setTitle] = useState(resource.title)
  const [category, setCategory] = useState<string | null>(resource.category)
  const [path, setPath] = useState(resource.path)
  const [visibleDate, setVisibleDate] = useState(format(resource.visible_after, 'yyyy-MM-dd'))
  const [visibleTime, setVisibleTime] = useState(format(resource.visible_after, 'HH:mm'))

  useEffect(() => onResourceChange('title', title), [title])
  useEffect(() => onResourceChange('category', category), [category])
  useEffect(() => onResourceChange('path', path), [path])
  useEffect(() => {
    visibleDate &&
      visibleTime &&
      onResourceChange('visible_after', getUTCDatetime(visibleDate, visibleTime))
  }, [addToast, visibleDate, visibleTime])

  if (resource === null) return null
  return (
    <>
      {resource.type === 'link' && (
        <div style={{ marginTop: '0.5rem' }}>
          <Label htmlFor="resourceLink" css={{ lineHeight: '2rem', marginRight: '1rem' }}>
            URL
          </Label>

          <TitleInput
            type="url"
            value={path}
            name="resourceLink"
            placeholder="https://www.example.com"
            onChange={({ target: { value } }) => setPath(value)}
            required
          />
        </div>
      )}

      <div style={{ marginTop: '0.5rem' }}>
        <Label htmlFor="resourceTitle" css={{ lineHeight: '2rem', marginRight: '1rem' }}>
          Title of resource
        </Label>

        <TitleInput
          type="text"
          value={title}
          name="resourceTitle"
          placeholder="Title"
          onChange={({ target: { value } }) => setTitle(value)}
          required
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Label
          htmlFor="editCategory"
          css={{
            marginRight: '1rem',
            marginTop: '0.5rem',
            marginBottom: '0.5rem',
          }}
        >
          Category
        </Label>
        {setForAllResources && (
          <ApplyToAllButton
            type="button"
            onClick={() => {
              if (!category) return
              setForAllResources('category', category)
              addToast({
                variant: 'info',
                title: `Category '${category}' applied to all uploaded files`,
              })
            }}
          >
            Apply category to all
          </ApplyToAllButton>
        )}

        <div style={{ marginTop: '0.5rem' }}>
          <Creatable
            styles={DropdownStyle}
            isClearable
            placeholder={'Select or create a new category'}
            value={category ? { value: category, label: category } : null}
            onChange={(newValue) => setCategory(newValue?.value || null)}
            options={categoryOptions}
            onCreateOption={(value) => {
              setCategory(value)
              if (value !== null)
                setCategoryOptions((categoryOptions: any) => [
                  ...categoryOptions,
                  { value, label: value },
                ])
            }}
            classNamePrefix={'edit-select'}
            maxMenuHeight={MAX_OPTIONS_MENU_HEIGHT}
          />
        </div>
      </div>

      <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
        <Label
          htmlFor="editVisibleAfter"
          css={{ lineHeight: '2rem', marginRight: '1rem', marginTop: '15rem' }}
        >
          Publish date:
        </Label>
        {setForAllResources && (
          <ApplyToAllButton
            type="button"
            onClick={() => {
              if (!visibleDate || !visibleTime) return
              const visibleAfter = getUTCDatetime(visibleDate, visibleTime)
              setForAllResources('visible_after', visibleAfter)
              addToast({
                variant: 'info',
                title: `All uploaded files set to publish at ${displayTimestamp(
                  visibleAfter,
                  'HH:mm, d LLL yy'
                )}`,
              })
            }}
          >
            Apply date to all
          </ApplyToAllButton>
        )}

        <div style={{ display: 'flex', colorScheme: theme }}>
          <CalendarInput
            type="date"
            style={{ marginRight: '1rem' }}
            value={visibleDate}
            onChange={(event) => setVisibleDate(event.target.value)}
            required
          />
          <TimeInput
            type="time"
            value={visibleTime}
            onChange={(event) => setVisibleTime(event.target.value)}
            required
          />
        </div>

        <div style={{ marginTop: '0.8rem' }}>
          <NowButton
            type="button"
            onClick={() => {
              const now = utcToZonedTime(new Date(), LONDON_TIMEZONE)
              setVisibleDate(format(now, 'yyyy-MM-dd'))
              setVisibleTime(format(now, 'HH:mm'))
            }}
          >
            Publish now
          </NowButton>
          <Visibility
            style={{
              visibility:
                getUTCDatetime(visibleDate, visibleTime) <= new Date() ? 'visible' : 'hidden',
            }}
          >
            <InfoCircle style={{ marginRight: '0.25rem' }} />
            This resource will be visible to students
          </Visibility>
        </div>
      </div>
    </>
  )
}

export default ResourceDetailsForm
