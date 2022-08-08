import { Accordion, Item } from '@radix-ui/react-accordion'
import { utcToZonedTime } from 'date-fns-tz'
import { useEffect, useState } from 'react'
import { X } from 'react-bootstrap-icons'
import Dropzone from 'react-dropzone'

import { LONDON_TIMEZONE } from '../../../constants/global'
import { ResourceCreate } from '../../../constants/types'
import { useResources } from '../../../lib/resource.service'
import { useToast } from '../../../lib/toast.context'
import { Caret, Content, DropzoneContainer, Header, Trigger } from '../../../styles/upload-dialog.style'
import Dialog from '../Dialog'
import ResourceDetailsForm from './components/ResourceDetailsForm'

function borderRadiusForIndex(index: number, totalItems: number, isIndexOfSelectedItem: boolean): string {
  let borderRadius = '0'
  if (totalItems === 1 && !isIndexOfSelectedItem) borderRadius = '0.5rem'
  else if (totalItems === 1 && isIndexOfSelectedItem) borderRadius = '0.5rem 0.5rem 0 0'
  else if (index === 0) borderRadius = '0.5rem 0.5rem 0 0'
  else if (index === totalItems - 1 && !isIndexOfSelectedItem) borderRadius = '0 0 0.5rem 0.5rem'
  return borderRadius
}

const FileUploadDialog = ({
  open,
  onOpenChange,
  categories,
  setGroupedMaterials,
}: {
  open: boolean
  onOpenChange: (_: boolean) => void
  categories: string[]
  setGroupedMaterials: any
}) => {
  const { addToast } = useToast()
  const { uploadResource } = useResources()
  const [fileResources, setFileResources] = useState<ResourceCreate[]>([])
  const [openItemIndex, setOpenItemIndex] = useState('0')
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    setCategoryOptions(categories.map((category) => ({ value: category, label: category })))
  }, [categories])

  function onDrop(files: any) {
    setFileResources([
      ...fileResources,
      ...files.map((file: any) => {
        return {
          title: file.name,
          category: null,
          visible_after: utcToZonedTime(new Date(), LONDON_TIMEZONE),
          file,
          type: 'file',
          path: '',
        }
      }),
    ])
  }

  function onResourceChange(resourceIndex: number) {
    return (key: string, value: any) =>
      setFileResources((resources: ResourceCreate[]) =>
        resources.map((res, index) => (index === resourceIndex ? { ...res, [key]: value } : res))
      )
  }

  const setForAllResources = (key: string, value: string) => {
    setFileResources((resources: ResourceCreate[]) => resources.map((res) => ({ ...res, [key]: value })))
  }

  const isFormValid = (): boolean => {
    let isValid = true
    fileResources.forEach((res: ResourceCreate, index: number) => {
      if (res.category === '' || res.category === null) {
        addToast({ variant: 'error', title: `Missing category for ${res.file?.name}` })
        isValid = false
      } else if (openItemIndex !== index.toString() && res.title === '') {
        addToast({ variant: 'error', title: `Missing title for ${res.file?.name}` })
        isValid = false
      }
    })
    return isValid
  }

  return (
    <Dialog
      title={'Upload resources'}
      primaryButtonText={'Upload'}
      secondaryButtonText={'Cancel'}
      onPrimaryClick={() => {
        fileResources.map((res) => uploadResource(res, setGroupedMaterials))
        setFileResources([])
      }}
      isFormValid={isFormValid}
      open={open}
      onOpenChange={onOpenChange}
    >
      <DropzoneContainer style={{ cursor: 'pointer', borderStyle: 'dashed', borderWidth: '2px' }}>
        <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps }) => (
            <section>
              <div {...getRootProps()} style={{ textAlign: 'center', padding: '1rem' }}>
                <input {...getInputProps()} />
                <p>
                  Drag files here
                  <br />
                  or
                  <br />
                  click to select files
                </p>
              </div>
            </section>
          )}
        </Dropzone>
      </DropzoneContainer>
      <Accordion type="single" collapsible value={openItemIndex} onValueChange={setOpenItemIndex}>
        {fileResources &&
          fileResources.map((resource: ResourceCreate, index: number) => {
            const isIndexOfSelectedItem = index.toString() === openItemIndex
            const borderRadius = borderRadiusForIndex(index, fileResources.length, isIndexOfSelectedItem)

            return (
              <Item key={index} value={index.toString()}>
                <Header>
                  <Trigger type="button" style={{ borderRadius, display: 'float', justifyContent: 'space-between' }}>
                    <div>
                      <Caret />
                      <span>{resource.title || resource.file?.name}</span>
                    </div>
                    <X onClick={() => setFileResources((resources) => resources.filter((_, i) => i !== index))} />
                  </Trigger>
                </Header>
                <Content>
                  <ResourceDetailsForm
                    onResourceChange={onResourceChange(index)}
                    resource={resource}
                    categoryOptions={categoryOptions}
                    setCategoryOptions={setCategoryOptions}
                    setForAllResources={setForAllResources}
                  />
                </Content>
              </Item>
            )
          })}
      </Accordion>
    </Dialog>
  )
}

export default FileUploadDialog
