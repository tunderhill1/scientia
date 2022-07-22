import { useContext } from 'react'

import { endpoints } from '../../constants/endpoints'
import { AxiosContext } from '../../lib/axios.context'
import { styled } from '../../styles/stitches.config'
import Dialog from './Dialog'

const DeleteDialog = ({
  open,
  onOpenChange,
  selectedIDs,
  year,
  moduleCode,
  groupedMaterials,
  setGroupedMaterials,
  groupByProperty,
}: {
  open: boolean
  onOpenChange: (_: boolean) => void
  selectedIDs: number[]
  year: number
  moduleCode: string | null
  groupedMaterials: any
  setGroupedMaterials: any
  groupByProperty: any
}) => {
  const axiosInstance = useContext(AxiosContext)
  const onDelete = async () => {
    await axiosInstance
      .request({
        method: 'DELETE',
        url: endpoints.resources,
        params: {
          year: year,
          course: moduleCode,
          id: selectedIDs,
        },
      })
      .then(() => {
        axiosInstance
          .request({
            method: 'GET',
            url: endpoints.resources,
            params: { year: year, course: moduleCode },
          })
          .then((response: any) => setGroupedMaterials(groupByProperty(response.data, 'category', 'index')))
          .catch((error: any) => {
            // TODO:TOAST to report that getting new materials failed
            console.error(error)
          })
      })
      .catch((error: any) => {
        // TODO:TOAST to report that deletion failed
        console.error(error)
      })
  }

  const getResourceById = (id: number): any =>
    Object.values(groupedMaterials)
      .flat()
      .find((res: any) => res.id.toString() === id)

  const DialogLi = styled('li', {
    color: '$highContrast',
  })

  return (
    <Dialog
      title={'Are you sure you want to delete the selected resources?'}
      primaryButtonText={'Delete'}
      secondaryButtonText={'Cancel'}
      onPrimaryClick={onDelete}
      {...{ open, onOpenChange }}
    >
      <ul>
        {selectedIDs.map((id) => (
          <DialogLi key={id}>{getResourceById(id).title}</DialogLi>
        ))}
      </ul>
    </Dialog>
  )
}

export default DeleteDialog
