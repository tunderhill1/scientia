import { DialogClose, DialogPortal, Dialog as DialogRoot } from '@radix-ui/react-dialog'
import { ReactNode } from 'react'

import { Content, Overlay, PrimaryButton, SecondaryButton, Title } from '../../styles/dialog.style'

const ContentFrame = ({
  children,
  ...props
}: {
  children: ReactNode
  props?: { [x: string]: any }
}) => (
  <DialogPortal>
    <Overlay />
    <Content {...props}>{children}</Content>
  </DialogPortal>
)

const Dialog = ({
  open,
  onOpenChange,
  onPrimaryClick = () => {},
  isFormValid = () => true,
  title,
  primaryButtonText,
  secondaryButtonText,
  children,
}: {
  open: boolean
  onOpenChange: (_: boolean) => void
  onPrimaryClick?: () => void
  title?: string
  primaryButtonText?: string
  secondaryButtonText?: string
  isFormValid?: () => boolean
  children?: ReactNode
}) => (
  <DialogRoot open={open} onOpenChange={onOpenChange}>
    <ContentFrame>
      {title && <Title>{title}</Title>}
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
          {secondaryButtonText && (
            <DialogClose asChild>
              <SecondaryButton style={{ display: 'inline-block', width: '6rem' }}>
                {secondaryButtonText}
              </SecondaryButton>
            </DialogClose>
          )}
          {primaryButtonText && (
            <PrimaryButton
              type="submit"
              style={{ display: 'inline-block', marginLeft: '1rem', width: '6rem' }}
              css={{ backgroundColor: '$blue8' }}
            >
              {primaryButtonText}
            </PrimaryButton>
          )}
        </div>
      </form>
    </ContentFrame>
  </DialogRoot>
)

export default Dialog
