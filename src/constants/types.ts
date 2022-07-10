import { Type, Expose } from 'class-transformer'

export class Exercise {
  number: number
  title: string
  type: string

  @Expose({ name: 'submission_type' })
  submissionType: string

  @Type(() => Date)
  @Expose({ name: 'start_date' })
  startDate: Date

  @Expose({ name: 'end_date' })
  @Type(() => Date)
  endDate: Date
}

export class Module {
  code: string
  title: string
  terms: number[]
  staff: string[]

  @Type(() => Exercise)
  exercises: Exercise[]
}

/* A track is a list of non-overlapping exercises */
export type Track = Exercise[]

/* A track map associates a list of tracks with a module code */
export type TrackMap = { [code: string]: Track[] }
