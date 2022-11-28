import { utcToZonedTime } from 'date-fns-tz'
import { useState } from 'react'
import { DragDropContext } from 'react-beautiful-dnd'
import {
  ArrowDownUp,
  Check,
  Check2Circle,
  Dash,
  Download,
  Link,
  PencilSquare,
  Trash3Fill,
  Upload,
} from 'react-bootstrap-icons'
import { Helmet } from 'react-helmet-async'
import { useOutletContext, useParams } from 'react-router-dom'

import { CollapsibleList } from '../components/CollapsibleList'
import { Tabs } from '../components/Tabs'
import { Toolbar } from '../components/Toolbar'
import DeleteDialog from '../components/dialogs/DeleteDialog'
import EditDialog from '../components/dialogs/EditDialog'
import FileUploadDialog from '../components/dialogs/upload/FileUploadDialog'
import LinkUploadDialog from '../components/dialogs/upload/LinkUploadDialog'
import { LevelToggles } from '../components/game/LevelToggles'
import { endpoints } from '../constants/endpoints'
import { LONDON_TIMEZONE } from '../constants/global'
import titles from '../constants/titles'
import useChecklist from '../lib/checkbox.service'
import { useReordering } from '../lib/dragDrop.service'
import { useGame } from '../lib/game/game.context'
import { LevelsManager } from '../lib/game/levels.service'
import { useMaterials } from '../lib/materials.service'
import { useUser } from '../lib/user.context'
import { Button, Checkbox, Footnote, Indicator, Wrapper } from '../styles/_app.style'
import { Caret } from '../styles/collapsible-list.style'
import { ToggleDragDropButton } from '../styles/dragDrop.style'
import { Material, Tag, Tags } from '../styles/materials.style'
import { Toggle } from '../styles/toolbar.style'

const Materials = () => {
  const [checklistMode, setSelectionMode] = useState(false)
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [linkUploadDialogOpen, setLinkUploadDialogOpen] = useState(false)
  const [resourceToEdit, setResourceToEdit] = useState(null)
  const [dragEnabled, setDragEnabled] = useState(false)

  const { userDetails } = useUser()
  const { gameSettingOn } = useGame()
  const { moduleCode, levelsManager } = useOutletContext<{
    moduleCode: string | null
    levelsManager: LevelsManager
  }>()
  const moduleTitle = userDetails?.modules.find((m) => m.code === moduleCode)?.title
  const { year } = useParams()
  const {
    groupedMaterials,
    setRawMaterials,
    isLoaded,
    noMaterials,
    addCompleteResources,
    isComplete,
  } = useMaterials(levelsManager)
  const checklistManager = useChecklist(groupedMaterials, 'id', false)
  const { onDragEnd } = useReordering(setRawMaterials)

  const onComplete = () => {
    addCompleteResources(
      checklistManager
        .getCheckedItems()
        .map((resourceId) => parseInt(resourceId))
        .filter((resourceId) => !isComplete(resourceId))
    )
  }

  /* Toolbar button callbacks */
  const onDownload = () => {
    const idsToDownload = checklistManager.getCheckedItems()
    const queryParameter = idsToDownload.map((id) => `id=${id}`).join('&')
    window.open(
      `${endpoints.resourcesArchive}?year=${year!}&course=${moduleCode}&${queryParameter}`
    )
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
          <Wrapper inline>
            <span>{tab.title}</span>
            {gameSettingOn && isComplete(tab.id) && <Check2Circle size={19} />}
          </Wrapper>
          <Tags>
            {tab.tags.map((tag: string) => (
              <Tag key={`${tab.id}${tag}`}>#{tag}</Tag>
            ))}
          </Tags>
        </Material>
      )}
      href={(tab) => (tab.type === 'link' ? tab.path : endpoints.resourceFile(tab.id))}
      target="_blank"
      dragDropOptions={{
        dragEnabled,
        droppableId: items[0]?.category ?? 'empty',
      }}
    />
  )

  const initialToolbar = (
    <Toolbar style={{ marginBottom: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        {userDetails?.isStaff && (
          <>
            <Button icon onClick={() => setUploadDialogOpen(true)} title="Upload a file resources">
              <Upload size={22} />
            </Button>
            <Button
              icon
              onClick={() => setLinkUploadDialogOpen(true)}
              title="Upload a link resource"
            >
              <Link size={22} />
            </Button>
          </>
        )}
      </div>
    </Toolbar>
  )

  const toolbar = (
    <Toolbar style={{ marginBottom: '1rem' }}>
      <Toggle defaultPressed={checklistMode} onClick={(event) => setSelectionMode(!checklistMode)}>
        Bulk actions
      </Toggle>
      <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
        {!checklistMode && userDetails?.isStaff && (
          <>
            <Button icon onClick={() => setUploadDialogOpen(true)} title="Upload a file resources">
              <Upload size={22} />
            </Button>

            <Button
              icon
              onClick={() => setLinkUploadDialogOpen(true)}
              title="Upload a link resource"
            >
              <Link size={22} />
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
            {userDetails?.isStaff && (
              <Button
                icon
                css={{ marginRight: '0.75rem' }}
                onClick={() => setDeleteDialogOpen(true)}
                disabled={checklistManager.getCheckedItems().length === 0}
              >
                <Trash3Fill size={22} />
              </Button>
            )}
            {gameSettingOn && (
              <Button
                icon
                css={{ marginRight: '0.75rem' }}
                onClick={onComplete}
                disabled={checklistManager
                  .getCheckedItems()
                  .every((resourceId) => isComplete(parseInt(resourceId)))}
              >
                <Check2Circle size={22} />
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

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Helmet>
        <title>{titles.module(year, moduleCode, moduleTitle)}</title>
      </Helmet>
      <Wrapper>
        {noMaterials() ? (
          <>
            {initialToolbar}
            <Wrapper center>
              <span>{!isLoaded() ? 'Loading materials...' : 'No materials for this module.'}</span>
            </Wrapper>
          </>
        ) : (
          <>
            {gameSettingOn && levelsManager.hasMinLevels && <LevelToggles {...levelsManager} />}
            {userDetails?.isStaff && (
              <p style={{ margin: '1rem 1rem 2rem 1rem', textAlign: 'center' }}>
                <b>
                  The materials you upload here will be visible to all students. Please refrain from
                  uploading model answers and solutions to courseworks here.
                </b>
              </p>
            )}
            {toolbar}
            <CollapsibleList
              data={groupedMaterials}
              checklistMode={checklistMode}
              checklistManager={checklistManager}
              headerGenerator={headerGenerator}
              contentGenerator={contentGenerator}
              mainItemAction={
                (userDetails?.isStaff && {
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
            <Footnote muted center css={{ margin: '2rem 0' }}>
              Please contact the relevant module leader(s) for missing resources or if you'd like
              materials to be better organised. We recommend communicating via the EdStem forum.
            </Footnote>
          </>
        )}
      </Wrapper>
      {deleteDialogOpen && (
        <DeleteDialog
          onOpenChange={setDeleteDialogOpen}
          selectedIDs={checklistManager.getCheckedItems()}
          moduleCode={moduleCode}
          groupedMaterials={groupedMaterials}
          setRawMaterials={setRawMaterials}
        />
      )}
      {editDialogOpen && resourceToEdit !== null && (
        <EditDialog
          onOpenChange={setEditDialogOpen}
          categories={Object.keys(groupedMaterials)}
          setResourceToEdit={setResourceToEdit}
          resourceToEdit={resourceToEdit}
          moduleCode={moduleCode}
          setRawMaterials={setRawMaterials}
        />
      )}

      <FileUploadDialog
        open={uploadDialogOpen}
        onOpenChange={setUploadDialogOpen}
        categories={Object.keys(groupedMaterials)}
        setRawMaterials={setRawMaterials}
      />

      <LinkUploadDialog
        open={linkUploadDialogOpen}
        onOpenChange={setLinkUploadDialogOpen}
        categories={Object.keys(groupedMaterials)}
        setRawMaterials={setRawMaterials}
      />
    </DragDropContext>
  )
}

export default Materials
