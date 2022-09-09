import { Close, Popover, Portal, Trigger } from '@radix-ui/react-popover'
import { CSSProperties } from 'react'
import { Trash3Fill } from 'react-bootstrap-icons'

import { PopoverArrow, PopoverContent, TrashButton } from '../../../styles/deleteButton.style'
import { ActionButton } from '../../../styles/dialog.style'

const DeleteButton = ({
  name,
  deleteFile,
  style,
}: {
  name: string
  deleteFile: () => void
  style: CSSProperties
}) => (
  <Popover modal>
    <Trigger asChild>
      <TrashButton style={style}>
        <Trash3Fill size={24} />
      </TrashButton>
    </Trigger>
    <Portal>
      <PopoverContent>
        Are you sure you want to delete <b>{name}</b>?
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
          <Close asChild>
            <ActionButton secondary type="button" style={{ marginRight: '1rem' }}>
              Cancel
            </ActionButton>
          </Close>
          <ActionButton primary color={'destructive'} type="button" onClick={deleteFile}>
            Delete
          </ActionButton>
        </div>
        <PopoverArrow />
      </PopoverContent>
    </Portal>
  </Popover>
)

export default DeleteButton
