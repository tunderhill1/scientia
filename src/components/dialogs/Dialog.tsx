import { DialogClose, DialogPortal, Dialog as DialogRoot } from '@radix-ui/react-dialog'
import { ReactNode } from 'react'

import { Button } from '../../styles/_app.style'
import { Content, Overlay, Title } from '../../styles/dialog.style'

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
  isFormValid = () => true,
  title,
  primaryButtonText,
  secondaryButtonText,
  children,
}: {
  open: boolean
  onOpenChange: (_: boolean) => void
  onPrimaryClick: () => void
  isFormValid?: () => boolean
  title: string
  primaryButtonText: string
  secondaryButtonText: string
  children?: ReactNode
}) => (
  <DialogRoot open={open} onOpenChange={onOpenChange}>
    <ContentFrame>
      <Title>{title}</Title>
      <form
        onSubmit={(event) => {
          event.preventDefault()
          if (!isFormValid()) {
            return false
          } else {
            onPrimaryClick()
            onOpenChange(false)
            return true
          }
        }}
      >
        {children}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <DialogClose asChild>
            <Button type="button" style={{ display: 'inline-block', width: '6rem' }}>
              {secondaryButtonText}
            </Button>
          </DialogClose>
          <Button type="submit" style={{ display: 'inline-block', marginLeft: '1rem', width: '6rem' }}>
            {primaryButtonText}
          </Button>
        </div>
      </form>
    </ContentFrame>
  </DialogRoot>
)

export default Dialog
