import {
  CameraReelsFill,
  EnvelopeFill,
  ExplicitFill,
  Git,
  Icon,
  PeopleFill,
  StarHalf,
  UiChecks,
} from 'react-bootstrap-icons'

export interface Link {
  title: string
  description: string
  url: string
  icon: Icon
}

export const LINKS: Link[] = [
  {
    title: 'EdStem',
    description: 'Q&A discussion board',
    url: 'https://edstem.org',
    icon: PeopleFill,
  },
  {
    title: 'GitLab',
    description: 'Git version control',
    url: 'https://gitlab.doc.ic.ac.uk',
    icon: Git,
  },
  {
    title: 'LabTS',
    description: 'Submit code',
    url: 'https://teaching.doc.ic.ac.uk/labts',
    icon: UiChecks,
  },
  {
    title: 'Outlook',
    description: 'Emails',
    url: 'https://outlook.office.com',
    icon: EnvelopeFill,
  },
  {
    title: 'Panopto',
    description: 'Lecture recordings',
    url: 'https://imperial.cloud.panopto.eu',
    icon: CameraReelsFill,
  },
  {
    title: 'Peer Assessment',
    description: 'Group project feedback',
    url: 'https://peer-assessment.doc.ic.ac.uk',
    icon: StarHalf,
  },
  {
    title: 'eMarking',
    description: 'Assessment feedback',
    url: 'http://emarking.doc.ic.ac.uk/',
    icon: ExplicitFill,
  },
]
