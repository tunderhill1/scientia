import { CameraReelsFill, EnvelopeFill, Git, PeopleFill, StarHalf, UiChecks } from 'react-bootstrap-icons'

export type Link = {
  title: string
  url: string
  icon: React.ReactNode
}

/* TODO: Refactor the margin styling to avoid repetition */
export const links: Link[] = [
  {
    title: 'GitLab',
    url: 'https://gitlab.doc.ic.ac.uk',
    icon: <Git size={16} style={{ margin: '0 0.5rem 0 0.5rem' }} />,
  },
  {
    title: 'Outlook',
    url: 'https://outlook.office.com',
    icon: <EnvelopeFill size={16} style={{ margin: '0 0.5rem 0 0.5rem' }} />,
  },
  {
    title: 'EdStem',
    url: 'https://edstem.org',
    icon: <PeopleFill size={16} style={{ margin: '0 0.5rem 0 0.5rem' }} />,
  },
  {
    title: 'Panopto',
    url: 'https://imperial.cloud.panopto.eu',
    icon: <CameraReelsFill size={16} style={{ margin: '0 0.5rem 0 0.5rem' }} />,
  },
  {
    title: 'Peer Assessment',
    url: 'https://peer-assessment.doc.ic.ac.uk/',
    icon: <StarHalf size={16} style={{ margin: '0 0.5rem 0 0.5rem' }} />,
  },
  {
    title: 'LabTS',
    url: 'https://teaching.doc.ic.ac.uk/labts',
    icon: <UiChecks size={16} style={{ margin: '0 0.5rem 0 0.5rem' }} />,
  },
]
