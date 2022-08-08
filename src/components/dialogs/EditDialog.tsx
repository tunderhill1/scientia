import { useContext, useState } from 'react'

import { endpoints } from '../../constants/endpoints'
import { ResourceCreate } from '../../constants/types'
import { AxiosContext } from '../../lib/axios.context'
import { useToast } from '../../lib/toast.context'
import Dialog from './Dialog'
import ResourceDetailsForm from './upload/components/ResourceDetailsForm'

const EditDialog = ({
  resourceToEdit,
  setResourceToEdit,
  onOpenChange,
  categories,
  year,
  moduleCode,
  setGroupedMaterials,
  groupByProperty,
}: {
  resourceToEdit: any
  setResourceToEdit: (_: any) => void
  onOpenChange: (_: boolean) => void
  categories: string[]
  year: number
  moduleCode: string | null
  setGroupedMaterials: any
  groupByProperty: any
}) => {
  const axiosInstance = useContext(AxiosContext)
  const { addToast } = useToast()

  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>(
    categories.map((category) => ({ value: category, label: category }))
  )

  const onSubmit = async () => {
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
