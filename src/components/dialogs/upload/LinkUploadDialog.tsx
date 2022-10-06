import { useEffect, useState } from 'react'

import { ResourceCreate } from '../../../constants/types'
import { Resource } from '../../../lib/materials.service'
import { useResources } from '../../../lib/resource.service'
import { useToast } from '../../../lib/toast.context'
import { now } from '../../../lib/utilities.service'
import Dialog from '../Dialog'
import ResourceDetailsForm from './components/ResourceDetailsForm'

const defaultLinkResource: ResourceCreate = {
  title: '',
  category: null,
  visible_after: now(),
  type: 'link',
  path: '',
}

const LinkUploadDialog = ({
  open,
  onOpenChange,
  categories,
  setRawMaterials,
}: {
  open: boolean
  onOpenChange: (_: boolean) => void
  categories: string[]
  setRawMaterials: (_: Resource[]) => void
}) => {
  const { uploadResource } = useResources()
  const { addToast } = useToast()
  const [linkResource, setLinkResource] = useState<ResourceCreate>(defaultLinkResource)
  const [categoryOptions, setCategoryOptions] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    setCategoryOptions(categories.map((category) => ({ value: category, label: category })))
  }, [categories])

  function onLinkResourceChange(key: string, value: string) {
    setLinkResource((linkResource: ResourceCreate) => ({ ...linkResource, [key]: value }))
  }

  const isFormValid = (): boolean => {
    if (linkResource.category === null) {
      addToast({ variant: 'error', title: 'Missing category' })
      return false
    }
    return true
  }

  return (
    <Dialog
      title={'Upload Link'}
      primaryButtonText={'Upload'}
      secondaryButtonText={'Cancel'}
      onPrimaryClick={() => {
        uploadResource(linkResource, setRawMaterials)
        setLinkResource(defaultLinkResource)
      }}
      isFormValid={isFormValid}
      open={open}
      onOpenChange={onOpenChange}
    >
      <ResourceDetailsForm
        onResourceChange={onLinkResourceChange}
        resource={linkResource}
        categoryOptions={categoryOptions}
        setCategoryOptions={setCategoryOptions}
      />
    </Dialog>
  )
}

export default LinkUploadDialog
