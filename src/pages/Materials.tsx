import React, { useEffect, useState } from 'react'
import { Check, Dash, Download, PencilSquare, Trash3Fill, UiChecks } from 'react-bootstrap-icons'
import { useOutletContext } from 'react-router-dom'

import { CollapsibleList } from '../components/CollapsibleList'
import { Tabs } from '../components/Tabs'
import { Toolbar } from '../components/Toolbar'
import DeleteDialog from '../components/dialogs/DeleteDialog'
import EditDialog from '../components/dialogs/EditDialog'
import { endpoints } from '../constants/endpoints'
import { useAxios } from '../lib/axios.context'
import useChecklist from '../lib/checkbox.service'
import { useUser } from '../lib/user.context'
import { groupByProperty } from '../lib/utilities.service'
import { useYear } from '../lib/year.context'
import { Button, Checkbox, Footnote, Indicator, Wrapper } from '../styles/_app.style'
import { Caret } from '../styles/collapsible-list.style'
import { ToggleGroup, ToggleItem } from '../styles/toolbar.style'

const Materials = () => {
  const [checklistMode, setSelectionMode] = useState(false)
  const [groupedMaterials, setGroupedMaterials] = useState({})
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [resourceToEdit, setResourceToEdit] = useState(null)

  const moduleCode = useOutletContext<string | null>()
  const checklistManager = useChecklist(groupedMaterials, 'id', false)

  const { userDetails } = useUser()
  const { year } = useYear()
  const { data, loaded } = useAxios({
    url: endpoints.resources,
    method: 'GET',
    params: { year: year, course: moduleCode },
  })

  const noMaterials = () => groupedMaterials && Object.keys(groupedMaterials).length === 0

  useEffect(() => {
    if (data !== null) setGroupedMaterials(groupByProperty(data, 'category', 'index'))
  }, [data])

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

  const contentGenerator = (_: string, items: object[]) => (
    <Tabs
      data={items}
      /* TODO: Add the file tags to the generator; this would require layout (height) styling fixes elsewhere */
      generator={(tab: any) => <span>{tab.title}</span>}
      onClick={(tab: any) => {
        const link = tab.type === 'link' ? tab.path : endpoints.resourceFile(tab.id)
        window.open(link)
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
      {checklistMode && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          {userDetails.roleInDepartment === 'staff' && (
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
            <Indicator>{checklistManager.getCheckedState() === 'indeterminate' ? <Dash /> : <Check />}</Indicator>
          </Checkbox>
        </div>
      )}
    </Toolbar>
  )

  if (noMaterials())
    return (
      <Wrapper center>
        <span>No materials for this module.</span>
      </Wrapper>
    )

  return (
    <Wrapper>
      {toolbar}
      {loaded && (
        <CollapsibleList
          data={groupedMaterials}
          checklistMode={checklistMode}
          checklistManager={checklistManager}
          headerGenerator={headerGenerator}
          contentGenerator={contentGenerator}
          mainItemAction={{
            icon: <PencilSquare size={22} />,
            action: (item: any) => {
              setResourceToEdit(item)
              setEditDialogOpen(true)
            },
          }}
        />
      )}
      <DeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        selectedIDs={checklistManager.getCheckedItems()}
        {...{
          year,
          moduleCode,
          groupedMaterials,
          setGroupedMaterials,
          groupByProperty,
        }}
      />

      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        resource={resourceToEdit}
        categories={Object.keys(groupedMaterials)}
        {...{
          year,
          moduleCode,
          setGroupedMaterials,
          groupByProperty,
        }}
      />

      <Footnote muted center css={{ margin: '2rem 0' }}>
        Please contact the relevant module leader(s) for missing resources or if you'd like materials to be better
        organised; we recommend using EdStem to help them gauge the peer response.
      </Footnote>
    </Wrapper>
  )
}

export default Materials
