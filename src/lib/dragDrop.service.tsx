import { useContext } from 'react'
import { Draggable, DropResult, Droppable } from 'react-beautiful-dnd'
import { useOutletContext } from 'react-router-dom'

import { endpoints } from '../constants/endpoints'
import { SetState } from '../constants/types'
import { getItemStyle, getListStyle } from '../styles/dragDrop.style'
import { AxiosContext } from './axios.context'
import { useToast } from './toast.context'
import { groupByProperty } from './utilities.service'
import { useYear } from './year.context'

export type DragDropOptions = { dragEnabled: boolean; droppableId: string }

export const addDroppable = (
  data: any,
  attribute: string,
  { droppableId, dragEnabled }: DragDropOptions,
  renderTab: any
) => (
  <Droppable droppableId={droppableId}>
    {(droppableProvided, droppableSnapshot) => (
      <div ref={droppableProvided.innerRef} style={getListStyle(droppableSnapshot.isDraggingOver)}>
        {data?.map((tab: any, index: number) => (
          <Draggable
            key={tab[attribute]}
            draggableId={`${tab.id}`}
            index={index}
            isDragDisabled={!dragEnabled}
          >
            {(draggableProvided, draggableSnapshot) =>
              renderTab(tab, index, {
                ref: draggableProvided.innerRef,
                ...draggableProvided.draggableProps,
                ...draggableProvided.dragHandleProps,
                style: getItemStyle(
                  draggableSnapshot.isDragging,
                  draggableProvided.draggableProps.style
                ),
              })
            }
          </Draggable>
        ))}
        {droppableProvided.placeholder}
      </div>
    )}
  </Droppable>
)

export const useReordering = (setGroupedMaterials: SetState<{ [_: string]: any }>) => {
  const { year } = useYear()
  const axiosInstance = useContext(AxiosContext)
  const moduleCode = useOutletContext<string | null>()
  const { addToast } = useToast()

  const onDragEnd = ({ source, destination, draggableId }: DropResult) => {
    if (
      !moduleCode ||
      !destination ||
      (source.droppableId === destination.droppableId && source.index === destination.index)
    ) {
      // if dragged out of bounds or hasn't moved
      return
    }
    const draggedResourceId = parseInt(draggableId)
    if (isNaN(draggedResourceId)) return
    const newIndex = destination.index
    const newCategory = destination.droppableId

    axiosInstance
      .request({
        method: 'PUT',
        url: endpoints.resource(draggedResourceId),
        data: { category: newCategory, index: newIndex },
      })
      .then(() => {
        axiosInstance
          .request({
            method: 'GET',
            url: endpoints.resources,
            params: { year, course: moduleCode! },
          })
          .then(({ data }: any) =>
            setGroupedMaterials(groupByProperty(data, 'category', 'index', true))
          )
          .catch((error: any) => {
            console.error(error)
          })
      })
      .catch((error: any) => {
        addToast({
          variant: 'error',
          title: 'Error reordering resources. Original order is unchanged.',
        })
        console.error(error)
      })
  }
  return { onDragEnd }
}
