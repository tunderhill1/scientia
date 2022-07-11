import { useContext, useEffect, useState } from 'react'
import { Check, Dash, Download, UiChecks, PencilSquare, Trash3Fill } from 'react-bootstrap-icons'
import { useOutletContext } from 'react-router-dom'
import { Collapsible } from '../components/Collapsible'
import { Tabs } from '../components/Tabs'
import { Toolbar } from '../components/Toolbar'
import { endpoints } from '../constants/endpoints'
import { useAxios, AxiosContext } from '../lib/axios.context'
import useChecklist from '../lib/checkbox.service'
import { useUser } from '../lib/user.context'
import { groupByProperty } from '../lib/utilities.service'
import { useYear } from '../lib/year.context'
import { Caret } from '../styles/collapsible.style'
import { Checkbox, Indicator } from '../styles/_app.style'
import { ToggleGroup, ToggleItem } from '../styles/toolbar.style'
import { Button, Footnote, Wrapper } from '../styles/_app.style'
import React from 'react'
import Dialog from '../components/Dialog'

const Materials = () => {
  const axiosInstance = useContext(AxiosContext)
  const [checklistMode, setSelectionMode] = useState(false)
  const [groupedMaterials, setGroupedMaterials] = useState({})
  const [dialogOpen, setDialogOpen] = useState(false)

  const moduleCode = useOutletContext<string | null>()
  const checklistManager = useChecklist(groupedMaterials, 'id', false)

  const { role } = useUser()
  const { year } = useYear()
  const { data, loaded } = useAxios({
    url: endpoints.resources,
    method: 'GET',
    params: { year: year, course: moduleCode },
  })

  const noMaterials = () => groupedMaterials && Object.keys(groupedMaterials).length === 0
  const isStaff = () => role === 'staff'

  useEffect(() => {
    if (data !== null) setGroupedMaterials(groupByProperty(data, 'category', 'index'))
  }, [data])

  /* Toolbar button callbacks */
  const onDownload = () => {
    const idsToDownload = checklistManager.getCheckedItems()
    const queryParameter = idsToDownload.map((id) => `id=${id}`).join('&')
    window.open(`${endpoints.resourcesArchive}?year=${year}&course=${moduleCode}&${queryParameter}`)
  }

  const onDelete = () => setDialogOpen(true)

  const onConfirmDelete = async () => {
    await axiosInstance
      .request({
        method: 'DELETE',
        url: endpoints.resources,
        params: {
          year: year,
          course: moduleCode,
          id: checklistManager.getCheckedItems(),
        },
      })
      .then((response: any) => {
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
          {isStaff() ? <PencilSquare size={22} /> : <UiChecks size={22} />}
        </ToggleItem>
      </ToggleGroup>
      {checklistMode && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
          {isStaff() && (
            <Button
              icon
              css={{ marginRight: '0.75rem' }}
              onClick={onDelete}
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
        <Collapsible
          data={groupedMaterials}
          checklistMode={checklistMode}
          checklistManager={checklistManager}
          headerGenerator={headerGenerator}
          contentGenerator={contentGenerator}
        />
      )}
      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onPrimaryClick={onConfirmDelete}
        title={'Are you sure you want to delete the selected resources?'}
        primaryButtonText={'Delete'}
        secondaryButtonText={'Cancel'}
      />
      <Footnote muted center css={{ margin: '2rem 0' }}>
        Please contact the relevant module leader(s) for missing resources or if you'd like materials to be better
        organised; we recommend using EdStem to help them gauge the peer response.
      </Footnote>
    </Wrapper>
  )
}

export default Materials
