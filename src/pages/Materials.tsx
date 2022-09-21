import { utcToZonedTime } from 'date-fns-tz'
import { useEffect, useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import {
  ArrowDownUp,
  Check,
  Dash,
  Download,
  Link45deg,
  PencilSquare,
  Trash3Fill,
  UiChecks,
  Upload,
} from 'react-bootstrap-icons'
import { useOutletContext } from 'react-router-dom'

import { CollapsibleList } from '../components/CollapsibleList'
import { Tabs } from '../components/Tabs'
import { Toolbar } from '../components/Toolbar'
import DeleteDialog from '../components/dialogs/DeleteDialog'
import EditDialog from '../components/dialogs/EditDialog'
import FileUploadDialog from '../components/dialogs/upload/FileUploadDialog'
import LinkUploadDialog from '../components/dialogs/upload/LinkUploadDialog'
import { endpoints } from '../constants/endpoints'
import { LONDON_TIMEZONE } from '../constants/global'
import { useAxios } from '../lib/axios.context'
import useChecklist from '../lib/checkbox.service'
import { useReordering } from '../lib/dragDrop.service'
import { useUser } from '../lib/user.context'
import { groupByProperty } from '../lib/utilities.service'
import { useYear } from '../lib/year.context'
import { Button, Checkbox, Footnote, Indicator, Wrapper } from '../styles/_app.style'
import { Caret } from '../styles/collapsible-list.style'
import { ToggleDragDropButton } from '../styles/dragDrop.style'
import { Material, Tag, Tags } from '../styles/materials.style'
import { ToggleGroup, ToggleItem } from '../styles/toolbar.style'

const Materials = () => {
  const [checklistMode, setSelectionMode] = useState(false)
  const [groupedMaterials, setGroupedMaterials] = useState<{ [_: string]: any }>({})
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [linkUploadDialogOpen, setLinkUploadDialogOpen] = useState(false)
  const [resourceToEdit, setResourceToEdit] = useState(null)
  const [dragEnabled, setDragEnabled] = useState(false)

  const moduleCode = useOutletContext<string | null>()
  const checklistManager = useChecklist(groupedMaterials, 'id', false)
  const { onDragEnd } = useReordering(setGroupedMaterials)

  const { userDetails } = useUser()
  const { year } = useYear()
  const { data: rawMaterials, loaded } = useAxios({
    url: endpoints.resources,
    method: 'GET',
    params: { year, course: moduleCode },
  })

  const noMaterials = () => groupedMaterials && Object.keys(groupedMaterials).length === 0
  const isStaff = () => userDetails?.roleInDepartment === 'staff'

  useEffect(() => {
    if (rawMaterials !== null)
      setGroupedMaterials(groupByProperty(rawMaterials, 'category', 'index', true))
  }, [rawMaterials])

  /* Toolbar button callbacks */
  const onDownload = () => {
    const idsToDownload = checklistManager.getCheckedItems()
    const queryParameter = idsToDownload.map((id) => `id=${id}`).join('&')
    window.open(`${endpoints.resourcesArchive}?year=${year}&course=${moduleCode}&${queryParameter}`)
  }

  const headerGenerator = (collection: string, _: object[]) => (
    <>
      <Caret />
      <span>{collection}</span>
    </>
  )

  const contentGenerator = (_: string, items: { [_: string]: any }[]) => (
    <Tabs
      data={items}
      generator={(tab: any) => (
        <Material>
          <span>{tab.title}</span>
          <Tags>
            {tab.tags.map((tag: string) => (
              <Tag key={`${tab.id}${tag}`}>#{tag}</Tag>
            ))}
          </Tags>
        </Material>
      )}
      onClick={(tab: any) => {
        const link = tab.type === 'link' ? tab.path : endpoints.resourceFile(tab.id)
        window.open(link)
      }}
      dragDropOptions={{
        dragEnabled,
        droppableId: items[0]?.category ?? 'empty',
      }}
    />
  )

  const toolbar = (
    <Toolbar style={{ marginBottom: '1rem' }}>
      <ToggleGroup type="single">
        <ToggleItem value="select" onClick={(event) => setSelectionMode(!checklistMode)}>
          <UiChecks size={22} />
        </ToggleItem>
      </ToggleGroup>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        {!checklistMode && isStaff() && (
          <>
            <Button icon onClick={() => setUploadDialogOpen(true)} title="Upload file resources">
              <Upload size={22} />
            </Button>

            <Button
              icon
              onClick={() => setLinkUploadDialogOpen(true)}
              title="Upload a link resource"
            >
              <Link45deg size={22} />
            </Button>
            <ToggleDragDropButton
              icon
              dragEnabled={dragEnabled}
              onClick={() => setDragEnabled((prev) => !prev)}
              title={`${dragEnabled ? 'Disable' : 'Enable'} resource reordering`}
            >
              <ArrowDownUp size={22} />
            </ToggleDragDropButton>
          </>
        )}
        {checklistMode && (
          <>
            {isStaff() && (
              <Button
                icon
                css={{ marginRight: '0.75rem' }}
                onClick={() => setDeleteDialogOpen(true)}
                disabled={checklistManager.getCheckedItems().length === 0}
              >
                <Trash3Fill size={22} />
              </Button>
            )}
            <Button
              icon
              css={{ marginRight: '0.75rem' }}
              onClick={onDownload}
              disabled={checklistManager.getCheckedItems().length === 0}
            >
              <Download size={22} />
            </Button>
            <Checkbox
              css={{ marginTop: '0.5rem' }}
              checked={checklistManager.getCheckedState()}
              onCheckedChange={checklistManager.onToggle}
            >
              <Indicator>
                {checklistManager.getCheckedState() === 'indeterminate' ? <Dash /> : <Check />}
              </Indicator>
            </Checkbox>
          </>
        )}
      </div>
    </Toolbar>
  )

  if (noMaterials())
    return (
      <Wrapper center>
        <span>No materials for this module.</span>
      </Wrapper>
    )

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Wrapper>
        {toolbar}
        {loaded && (
          <CollapsibleList
            data={groupedMaterials}
            checklistMode={checklistMode}
            checklistManager={checklistManager}
            headerGenerator={headerGenerator}
            contentGenerator={contentGenerator}
            mainItemAction={
              (isStaff() && {
                icon: <PencilSquare size={22} />,
                action: (item: any) => {
                  setResourceToEdit({
                    ...item,
                    visible_after: utcToZonedTime(item.visible_after, LONDON_TIMEZONE),
                  })
                  setEditDialogOpen(true)
                },
              }) ||
              undefined
            }
          />
        )}
        {deleteDialogOpen && (
          <DeleteDialog
            onOpenChange={setDeleteDialogOpen}
            selectedIDs={checklistManager.getCheckedItems()}
            moduleCode={moduleCode}
            groupedMaterials={groupedMaterials}
            setGroupedMaterials={setGroupedMaterials}
          />
        )}

        {editDialogOpen && resourceToEdit !== null && (
          <EditDialog
            onOpenChange={setEditDialogOpen}
            categories={Object.keys(groupedMaterials)}
            setResourceToEdit={setResourceToEdit}
            resourceToEdit={resourceToEdit}
            moduleCode={moduleCode}
            setGroupedMaterials={setGroupedMaterials}
          />
        )}

        <FileUploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
          categories={Object.keys(groupedMaterials)}
          setGroupedMaterials={setGroupedMaterials}
        />

        <LinkUploadDialog
          open={linkUploadDialogOpen}
          onOpenChange={setLinkUploadDialogOpen}
          categories={Object.keys(groupedMaterials)}
          setGroupedMaterials={setGroupedMaterials}
        />

        <Footnote muted center css={{ margin: '2rem 0' }}>
          Please contact the relevant module leader(s) for missing resources or if you'd like
          materials to be better organised; we recommend using EdStem to help them gauge the peer
          response.
        </Footnote>
      </Wrapper>
    </DragDropContext>
  )
}

export default Materials
