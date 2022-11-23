import { Expose, Type } from 'class-transformer'
import { Dispatch, ReactNode, SetStateAction } from 'react'

import cohorts from './cohorts'
import { endpoints } from './endpoints'

export type SetState<Value> = Dispatch<SetStateAction<Value>>
export type LocationState = { next: string }

export class UserDetails {
  login: string
  year: string
  email: string
  cohort: string
  firstname: string
  lastname: string

  @Expose({ name: 'role_in_department' })
  roleInDepartment: string

  @Type(() => Module)
  modules: Module[]

  @Type(() => Module)
  @Expose({ name: 'modules_helped' })
  modulesHelped: Module[]

  get isStaff(): boolean {
    return this.roleInDepartment === 'staff'
  }

  get cohortName(): string | undefined {
    return cohorts?.[this.cohort]
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
  @Expose({ name: 'is_assessed' })
  isAssessed?: boolean

  @Type(() => Date)
  @Expose({ name: 'start_date' })
  startDate: Date
  @Type(() => Date)
  @Expose({ name: 'end_date' })
  endDate: Date
  @Type(() => Date)
  @Expose({ name: 'extended_end_date' })
  extendedEndDate: Date | null

  @Expose({ name: 'module_code' })
  moduleCode: string
  @Expose({ name: 'module_name' })
  moduleName: string

  @Expose({ name: 'maximum_mark' })
  maximumMark: number
  mark: number | null

  get deadline(): Date {
    return this.extendedEndDate ?? this.endDate
  }

  get isGroup(): boolean {
    return this.submissionType === 'group'
  }
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

  @Type(() => Date)
  timestamp: Date
  @Expose({ name: 'target_submission_file_name' })
  targetFileName: string
  @Expose({ name: 'file_size' })
  fileSize: number

  @Expose({ name: 'module_code' })
  moduleCode: string
  @Expose({ name: 'exercise_number' })
  exerciseNumber: number

  get url(): string {
    return endpoints.submissionFile(this.year, this.moduleCode, this.exerciseNumber, this.id)
  }
}

export class Feedback {
  id: number
  year: string

  @Expose({ name: 'module_code' })
  moduleCode: string

  @Expose({ name: 'exercise_number' })
  exerciseNumber: number

  @Expose({ name: 'timestamp' })
  timestamp: Date | null
}

export interface GroupMembersActions {
  deleteMember: (member: GroupMember, asMember?: boolean) => void
  sendInvite: (invitedUsernames: string[]) => void
  answerInvite: (accepted: boolean, memberId: number) => void
  deleteGroup: () => void
}

export class EnrolledStudent {
  id: number
  login: string
  available: boolean
  firstname: string
  lastname: string

  get fullname(): string {
    return this.firstname + ' ' + this.lastname
  }
}

export interface Option {
  value: string
  label: ReactNode
  available: boolean
}

export class GroupMember {
  id: number
  username: string

  @Expose({ name: 'is_leader' })
  isLeader: boolean

  invited: string | null
  accepted: string | null

  get role(): string {
    return this.isLeader ? 'leader' : this.accepted ? 'member' : 'invited'
  }

  get isConfirmed(): boolean {
    return this.isLeader || !!this.accepted
  }

  fullName(enrolledStudents: EnrolledStudent[]): string {
    return (
      enrolledStudents.find((person: EnrolledStudent) => person.login === this.username)
        ?.fullname ?? ''
    )
  }
}

export class Group {
  id: number
  year: string

  @Type(() => GroupMember)
  members: GroupMember[]

  @Expose({ name: 'exercise_number' })
  exerciseNumber: number

  @Expose({ name: 'module_code' })
  moduleCode: string

  get leader(): string | null {
    return this.members.find((m) => m.isLeader)?.username ?? null
  }

  getMember(login: string): GroupMember | undefined {
    return this.members.find((m) => m.username === login)
  }

  isMember(login: string): boolean {
    return this.members.some((member) => member.username === login)
  }
}
