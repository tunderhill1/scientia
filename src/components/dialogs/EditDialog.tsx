import { useContext, useEffect, useState } from 'react'
import { Trash3Fill } from 'react-bootstrap-icons'
import Dropzone from 'react-dropzone'
import { useParams } from 'react-router-dom'

import { endpoints } from '../../constants/endpoints'
import { ResourceCreate } from '../../constants/types'
import { AxiosContext } from '../../lib/axios.context'
import { Resource } from '../../lib/materials.service'
import { useToast } from '../../lib/toast.context'
import { Button, Hr, StandardDiv } from '../../styles/_app.style'
import { DropzoneContainer } from '../../styles/upload-dialog.style'
import Dialog from './Dialog'
import ResourceDetailsForm from './upload/components/ResourceDetailsForm'

const EditDialog = ({
  resourceToEdit,
  setResourceToEdit,
  onOpenChange,
  categories,
  moduleCode,
  setRawMaterials,
}: {
  resourceToEdit: any
  setResourceToEdit: (_: any) => void
  onOpenChange: (_: boolean) => void
  categories: string[]
  moduleCode: string | null
  setRawMaterials: (_: Resource[]) => void
}) => {
  const { year } = useParams()
  const axiosInstance = useContext(AxiosContext)
  const { addToast } = useToast()
  const [newResourceFile, setNewResourceFile] = useState<File>()
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    setCategoryOptions(categories.map((category) => ({ value: category, label: category })))
  }, [categories])

  const onSubmit = async () => {
    if (newResourceFile) {
      let formData = new FormData()
      formData.append('file', newResourceFile)
      await axiosInstance
        .request({
          method: 'PUT',
          url: endpoints.resourceFileToUpdate(resourceToEdit.id),
          data: formData,
        })
        .catch((error: any) => {
          addToast({
            variant: 'error',
            title: `Error uploading file '${newResourceFile.name}.`,
          })
          console.error(error)
        })
    }
    await axiosInstance
      .request({
        method: 'PUT',
        url: endpoints.resource(resourceToEdit.id),
        data: {
          title: resourceToEdit.title,
          category: resourceToEdit.category,
          visible_after: resourceToEdit.visible_after,
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
          .then(({ data }: any) => setRawMaterials(data))
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

  const isFormValid = (): boolean => {
    if (resourceToEdit.category === null) {
      addToast({ variant: 'error', title: 'Missing category' })
      return false
    }
    return true
  }

  const onResourceChange = (key: string, value: string) => {
    setResourceToEdit((resource: ResourceCreate) => ({ ...resource, [key]: value }))
  }

  const UploadedFileRow = () => {
    return (
      <>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            justifyContent: 'space-between',
            marginTop: '2rem',
          }}
        >
          <StandardDiv>{newResourceFile!.name}</StandardDiv>
          <Button icon onClick={() => setNewResourceFile(undefined)} title="Delete uploaded file">
            <Trash3Fill size={22} />
          </Button>
        </div>
        <Hr style={{ margin: '1rem' }} />
      </>
    )
  }

  if (resourceToEdit === null) return null
  return (
    <Dialog
      title={`Edit "${resourceToEdit.title}"`}
      primaryButtonText="Save"
      secondaryButtonText="Cancel"
      onPrimaryClick={onSubmit}
      open={true}
      onOpenChange={onOpenChange}
      isFormValid={isFormValid}
    >
      {resourceToEdit.type === 'file' && (
        <Dropzone multiple={false} onDrop={([file]) => setNewResourceFile(file)}>
          {({ getRootProps, getInputProps }) => (
            <DropzoneContainer {...getRootProps({ className: 'dropzone' })}>
              <input {...getInputProps()} />
              <p>Drag a new file here or click to select one</p>
            </DropzoneContainer>
          )}
        </Dropzone>
      )}
      {resourceToEdit.type === 'file' && newResourceFile && <UploadedFileRow />}
      <ResourceDetailsForm
        resource={resourceToEdit}
        onResourceChange={onResourceChange}
        categoryOptions={categoryOptions}
        setCategoryOptions={setCategoryOptions}
      />
    </Dialog>
  )
}

export default EditDialog
