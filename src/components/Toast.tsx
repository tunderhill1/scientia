import { ToastViewport, Root as ToastRoot, ToastTitle, ToastDescription, ToastClose } from '@radix-ui/react-toast'
import { styled } from '../styles/stitches.config'

export const Viewport = styled(ToastViewport, {
  position: 'fixed',
  bottom: '1rem',
  right: '1rem',
  listStyle: 'none',
})

export const Toast = ({
  open,
  onOpenChange,
  title,
  description,
}: {
  open: boolean
  onOpenChange: (_: boolean) => void
  title: string
  description: string
}) => {
  return (
    <ToastRoot open={open} onOpenChange={onOpenChange}>
      <ToastTitle>{title}</ToastTitle>
      <ToastDescription asChild>{description}</ToastDescription>
      <ToastClose />
    </ToastRoot>
  )
}
