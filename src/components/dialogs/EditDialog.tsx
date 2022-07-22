import { format } from 'date-fns'
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz'
import { useContext, useEffect, useState } from 'react'
import { InfoCircle } from 'react-bootstrap-icons'
import Creatable from 'react-select/creatable'

import { endpoints } from '../../constants/endpoints'
import { LONDON_TIMEZONE } from '../../constants/global'
import { AxiosContext } from '../../lib/axios.context'
import { ThemeContext } from '../../lib/theme.context'
import { useToast } from '../../lib/toast.context'
import {
  CalendarInput,
  DropdownStyle,
  Label,
  NowButton,
  TimeInput,
  TitleInput,
  Visibility,
} from '../../styles/editDialog.style'
import Dialog from './Dialog'

const utcFormat = (date: Date, formatSpec: string): string => {
  const zonedDate = utcToZonedTime(`${date}Z`, LONDON_TIMEZONE)
  return format(zonedDate, formatSpec)
}

const EditDialog = ({
  resource,
  open,
  onOpenChange,
  categories,
  year,
  moduleCode,
  setGroupedMaterials,
  groupByProperty,
}: {
  resource: any | null
  open: boolean
  onOpenChange: (_: boolean) => void
  categories: string[]
  year: number
  moduleCode: string | null
  setGroupedMaterials: any
  groupByProperty: any
}) => {
  const axiosInstance = useContext(AxiosContext)
  const [categoryOptions, setCategoryOptions] = useState<string[]>(categories)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState<string | null>('')
  const [visibleDate, setVisibleDate] = useState('')
  const [visibleTime, setVisibleTime] = useState('')
  const [visibleAfter, setVisibleAfter] = useState<Date>(new Date(Date.UTC(3000, 1)))
  const { theme } = useContext(ThemeContext)
  const { addToast } = useToast()

  const onSubmit = async () => {
    await axiosInstance
      .request({
        method: 'PUT',
        url: endpoints.resource(resource.id),
        data: {
          title,
          category,
          visible_after: visibleAfter,
        },
      })
      .then(() => {
        addToast({ variant: 'success', title: 'Resource successfully edited' })
        axiosInstance
          .request({
            method: 'GET',
            url: endpoints.resources,
            params: { year, course: moduleCode },
          })
          .then(({ data }: any) => setGroupedMaterials(groupByProperty(data, 'category', 'index')))
          .catch((error: any) => {
            addToast({ variant: 'error', title: 'There was an error fetching resources' })
            console.error(error)
          })
      })
      .catch((error: any) => {
        addToast({ variant: 'error', title: 'There was an error editing this resource' })
        console.error(error)
      })
  }

  useEffect(() => {
    const visibleAfterUTC = zonedTimeToUtc(`${visibleDate} ${visibleTime}`, LONDON_TIMEZONE)
    setVisibleAfter(visibleAfterUTC)
  }, [visibleDate, visibleTime])

  useEffect(() => {
    setCategoryOptions(categories)
  }, [categories])

  useEffect(() => {
    if (resource === null) return
    setTitle(resource.title)
    setCategory(resource.category)
    setVisibleDate(utcFormat(resource.visible_after, 'yyyy-MM-dd'))
    setVisibleTime(utcFormat(resource.visible_after, 'HH:mm'))
  }, [resource])

  if (resource === null) return null
  return (
    <Dialog
      title={`Edit "${resource.title}"`}
      primaryButtonText="Save"
      secondaryButtonText="Cancel"
      onPrimaryClick={onSubmit}
      {...{ open, onOpenChange }}
    >
      <div style={{ marginTop: '0.5rem' }}>
        <Label htmlFor="resourceTitle" css={{ lineHeight: '2rem', marginRight: '1rem' }}>
          Title of resource
        </Label>

        <TitleInput
          type="text"
          value={title}
          name="resourceTitle"
          onChange={({ target: { value } }) => setTitle(value)}
        />
      </div>

      <div style={{ marginTop: '1rem' }}>
        <Label htmlFor="editCategory" css={{ marginRight: '1rem', marginTop: '0.5rem', marginBottom: '0.5rem' }}>
          Category
        </Label>

        <div style={{ marginTop: '0.5rem' }}>
          <Creatable
            styles={DropdownStyle}
            isClearable
            value={{ value: category, label: category }}
            onChange={(selected) => selected && setCategory(selected.value)}
            options={categories.map((c) => {
              return { value: c, label: c }
            })}
            onCreateOption={(value: string) => {
              setCategory(value)
              if (value !== null) setCategoryOptions([...categoryOptions, value])
            }}
            classNamePrefix={'edit-select'}
          />
        </div>
      </div>

      <div style={{ marginTop: '0.5rem', marginBottom: '0.5rem' }}>
        <Label htmlFor="editVisibleAfter" css={{ lineHeight: '2rem', marginRight: '1rem', marginTop: '15rem' }}>
          Visible after:
        </Label>

        <div style={{ display: 'flex', colorScheme: theme }}>
          <CalendarInput
            type="date"
            min={'2021-10-01'}
            max={'2022-09-30'}
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
            onClick={() => {
              const now = utcToZonedTime(new Date(), LONDON_TIMEZONE)
              setVisibleDate(format(now, 'yyyy-MM-dd'))
              setVisibleTime(format(now, 'HH:mm'))
            }}
          >
            Set to now
          </NowButton>
          <Visibility
            style={{
              visibility: visibleAfter <= new Date() ? 'visible' : 'hidden',
              marginTop: '1rem',
            }}
          >
            <InfoCircle style={{ marginRight: '0.25rem' }} />
            This resource will be visible to students
          </Visibility>
        </div>
      </div>
    </Dialog>
  )
}

export default EditDialog
