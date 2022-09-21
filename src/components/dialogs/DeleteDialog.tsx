import { useContext } from 'react'

import { endpoints } from '../../constants/endpoints'
import { AxiosContext } from '../../lib/axios.context'
import { useToast } from '../../lib/toast.context'
import { groupByProperty } from '../../lib/utilities.service'
import { useYear } from '../../lib/year.context'
import { css } from '../../styles/stitches.config'
import Dialog from './Dialog'

const DeleteDialog = ({
  onOpenChange,
  selectedIDs,
  moduleCode,
  groupedMaterials,
  setGroupedMaterials,
}: {
  onOpenChange: (_: boolean) => void
  selectedIDs: number[]
  moduleCode: string | null
  groupedMaterials: any
  setGroupedMaterials: any
}) => {
  const { year } = useYear()
  const { addToast } = useToast()
  const axiosInstance = useContext(AxiosContext)
  const onDelete = async () => {
    await axiosInstance
      .request({
        method: 'DELETE',
        url: endpoints.resources,
        params: {
          year,
          course: moduleCode,
          id: selectedIDs,
        },
      })
      .then(() => {
        addToast({ variant: 'success', title: 'Resource(s) successfully deleted' })
        axiosInstance
          .request({
            method: 'GET',
            url: endpoints.resources,
            params: { year, course: moduleCode },
          })
          .then((response: any) =>
            setGroupedMaterials(groupByProperty(response.data, 'category', 'index', true))
          )
          .catch((error: any) => {
            addToast({ variant: 'error', title: 'There was an error fetching resources' })
            console.error(error)
          })
      })
      .catch((error: any) => {
        addToast({ variant: 'error', title: 'There was an error deleting the selected resources.' })
        console.error(error)
      })
  }

  const getResourceById = (id: number): any =>
    Object.values(groupedMaterials)
      .flat()
      .find((res: any) => res.id.toString() === id)

  return (
    <Dialog
      title={'Are you sure you want to delete the selected resources?'}
      primaryButtonText={'Delete'}
      secondaryButtonText={'Cancel'}
      onPrimaryClick={onDelete}
      onOpenChange={onOpenChange}
      open={true}
    >
      <ul>
        {selectedIDs.map((id) => (
          <li className={css({ color: '$highContrast' })()} key={id}>
            {getResourceById(id).title}
          </li>
        ))}
      </ul>
    </Dialog>
  )
}

export default DeleteDialog
