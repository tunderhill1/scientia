import { DialogClose, DialogPortal, Dialog as DialogRoot } from '@radix-ui/react-dialog'
import React, { ReactNode } from 'react'

import { Button } from '../styles/_app.style'
import { Content, Overlay, Title } from '../styles/dialog.style'

const ContentFrame = ({ children, ...props }: { children: ReactNode; props?: { [x: string]: any } }) => (
  <DialogPortal>
    <Overlay />
    <Content {...props}>{children}</Content>
  </DialogPortal>
)

const Dialog = ({
  open,
  onOpenChange,
  onPrimaryClick,
  title,
  primaryButtonText,
  secondaryButtonText,
}: {
  open: boolean
  onOpenChange: (_: boolean) => void
  onPrimaryClick: () => void
  title: string
  primaryButtonText: string
  secondaryButtonText: string
}) => (
  <DialogRoot open={open} onOpenChange={onOpenChange}>
    <ContentFrame>
      <Title>{title}</Title>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <DialogClose asChild>
          <Button style={{ display: 'inline-block', width: '6rem' }}>{secondaryButtonText}</Button>
        </DialogClose>
        <DialogClose asChild>
          <Button style={{ display: 'inline-block', marginLeft: '1rem', width: '6rem' }} onClick={onPrimaryClick}>
            {primaryButtonText}
          </Button>
        </DialogClose>
      </div>
    </ContentFrame>
  </DialogRoot>
)

export default Dialog
