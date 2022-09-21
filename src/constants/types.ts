import { Expose, Type } from 'class-transformer'
import { Dispatch, SetStateAction } from 'react'

export type SetState<Value> = Dispatch<SetStateAction<Value>>

export class UserDetails {
  login: string
  email: string
  cohort: string
  firstname: string
  lastname: string

  @Expose({ name: 'role_in_department' })
  roleInDepartment: string

  @Type(() => Module)
  modules: Module[]

  isStaff() {
    return this.roleInDepartment === 'staff'
  }
}

export class ModuleStaff {
  login: string
  email: string
  firstname: string
  lastname: string
  department: string
  cid: string
}

export class Module {
  code: string
  title: string
  terms: number[]
  level?: number

  @Type(() => ModuleStaff)
  staff: ModuleStaff[]
}

export class Exercise {
  number: number
  title: string
  type: string
  owner: string

  @Expose({ name: 'estimated_work_hours' })
  estimatedWorkHours: number

  @Expose({ name: 'submission_type' })
  submissionType: string

  @Type(() => Date)
  @Expose({ name: 'start_date' })
  startDate: Date

  @Expose({ name: 'end_date' })
  @Type(() => Date)
  endDate: Date

  @Expose({ name: 'module_code' })
  moduleCode?: string

  @Expose({ name: 'module_name' })
  moduleName?: string

  @Expose({ name: 'maximum_mark' })
  maximumMark?: number
  mark?: number
}
export class ModuleWithExercises {
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

/**
 * NOTE: Terms from the backend have the following shape.
 * { name: string, start: Date, end: Date, weeks: number }
 * The start date's always a Monday and the end date's always a Friday
 * The weeks holds a count of the number of mondays in the term
 */
export type Term = {
  name: string
  start: Date
  end: Date
  weeks: number
}

export interface ResourceCreate {
  title: string
  category: string | null
  file?: File
  visible_after: Date
  type: string
  path: string
}

interface Material {
  name: string
  url: string
}

export interface FileRequirement {
  name: string
  max_size: number
}

export class ExerciseMaterials {
  spec: Material

  @Expose({ name: 'data_files' })
  dataFiles: Material[]

  @Expose({ name: 'model_answers' })
  modelAnswers: Material[]

  @Expose({ name: 'hand_ins' })
  fileRequirements: FileRequirement[]
}

export class SubmittedFile {
  username: string
  id: number
  year: string
  size: number

  @Expose({ name: 'module_code' })
  moduleCode: string

  @Expose({ name: 'file_size' })
  fileSize: number

  @Expose({ name: 'exercise_number' })
  exerciseNumber: number

  @Type(() => Date)
  timestamp: Date

  @Expose({ name: 'target_submission_file_name' })
  targetFileName: string
}
