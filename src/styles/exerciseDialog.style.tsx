import { BoxArrowUpRight, Envelope } from 'react-bootstrap-icons'

import { styled } from './stitches.config'

export const NotFound = styled('p', {
  textAlign: 'center',
  marginTop: '2rem',
  fontWeight: 'bold',
})

export const SpecLink = styled('a', {
  width: 'fit-content',
  alignItems: 'center',
  padding: '0.5rem 1rem',
  border: '2px solid $sand8',
  color: '$sand12',
  fill: '$sand12',
  fontWeight: 500,
  fontSize: '16px',
  borderRadius: '8px',
  textDecoration: 'none',
  display: 'inline-flex',
  cursor: 'pointer',
  userSelect: 'none',
  transition: 'all .1s ease-in',
  '&:hover': {
    background: '$blue9',
    border: '2px solid $blue10',
    color: 'white',
    fill: 'white',
  },
})

export const EmailButton = styled(Envelope, {
  cursor: 'pointer',
  fontSize: '1rem',
  '&:hover': {
    fill: '$lowContrast',
  },
})

export const TrashButton = styled('button', {
  width: 'fit-content',
  alignItems: 'center',
  padding: '0.5rem',
  color: '$sand12',
  fill: '$sand12',
  fontWeight: 500,
  fontSize: '16px',
  borderRadius: '8px',
  display: 'inline-flex',
  cursor: 'pointer',
  transition: 'all .1s ease-in',
  border: '2px solid $sand8',
  backgroundColor: 'white',
  '&:hover': {
    background: '$sand4',
  },
})

export const UploadWrapper = styled('div', {
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  margin: '1rem 0 1rem 0',
})

export const UploadTrigger = styled('label', {
  all: 'unset',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  padding: '1rem',
  borderRadius: '12px',
  color: '$highContrast',
  cursor: 'pointer',
  verticalAlign: 'middle',
  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,.06)) drop-shadow(0 1px 3px rgba(0,0,0,.1))',
  backgroundColor: '$sand1',
  '&:hover': {
    backgroundColor: '$sand2',
  },
})

export const ModulePill = styled('p', {
  background: '$blue5',
  fontSize: '14px',
  borderRadius: '16px',
  padding: '8px 12px',
  display: 'inline-flex',

  alignItems: 'center',
  width: 'fit-content',
  height: 'fit-content',
  margin: 0,
  textAlign: 'center',
})

export const ResourcesWrapper = styled('div', {
  display: 'grid',
  justifyItems: 'center',
  width: '100%',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '2rem',
  gridGap: '2rem',
  marginTop: '1rem',
})

export const LinkIcon = styled(BoxArrowUpRight, {
  marginRight: '0.5rem',
  fill: 'inherit',
  float: 'left',
  fontWeight: 500,
})

export const TitleWrapper = styled('div', {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
})

export const ExerciseTitle = styled('h3', {
  fontWeight: 400,
  fontSize: '2rem',
  width: 'fit-content',
})

export const EmailAddress = styled('address', {
  display: 'flex',
  alignItems: 'center',
})

export const Deadline = styled('p', {
  fontSize: '14px',
  color: '$highContrast',
})

export const SubmissionWrapper = styled('div', {
  marginTop: '1rem',
})

export const PlagiarismDisclaimer = styled('p', {
  fontSize: '0.9rem',
  marginTop: '1rem',
  textAlign: 'center',
})
