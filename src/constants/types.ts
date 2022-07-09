import { Type } from 'class-transformer'

export class Exercise {
  number: number
  title: string
  type: string
  submission_type: string

  @Type(() => Date)
  start_date: Date

  @Type(() => Date)
  end_date: Date
}

export class Module {
  code: string
  title: string
  terms: number[]
  staff: string[]

  @Type(() => Exercise)
  exercises: Exercise[]
}
