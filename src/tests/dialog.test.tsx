import { fireEvent, render, screen, within } from '@testing-library/react'
import Dialog from '../components/Dialog'

const DialogFactory = ({
  open = true,
  onOpenChange = (_) => {},
  onPrimaryClick = () => {},
  title = 'Dialog title',
  primaryButtonText = 'confirm',
  secondaryButtonText = 'cancel',
}: {
  open?: boolean
  onOpenChange?: (_: boolean) => void
  onPrimaryClick?: () => void
  title?: string
  primaryButtonText?: string
  secondaryButtonText?: string
}) => {
  return <Dialog {...{ open, onOpenChange, onPrimaryClick, title, primaryButtonText, secondaryButtonText }} />
}

describe('Dialog', () => {
  it(`renders dialog when open`, () => {
    render(DialogFactory({ open: true }))
    const dialog = screen.queryByRole('dialog')
    expect(dialog).toBeInTheDocument()
    const buttons = within(screen.getByRole('dialog')).queryAllByRole('button')
    expect(buttons).toHaveLength(2)
  })

  it(`does not render dialog when closed`, () => {
    render(DialogFactory({ open: false }))
    const dialog = screen.queryByRole('dialog')
    expect(dialog).not.toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it.each(['confirm', 'cancel'])(`closes dialog when you click %s button`, (buttonText) => {
    const onOpenChange = jest.fn((_: boolean) => {})
    render(DialogFactory({ onOpenChange }))
    fireEvent.click(screen.getByText(buttonText))
    expect(onOpenChange).toHaveBeenCalledTimes(1)
  })

  it('calls for deletion of resources when clicking primary button', () => {
    const onPrimaryClick = jest.fn()
    render(DialogFactory({ onPrimaryClick }))
    fireEvent.click(screen.getByText('confirm'))
    expect(onPrimaryClick).toHaveBeenCalledTimes(1)
  })
})
