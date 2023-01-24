import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import RawSubmissionsTable from '../components/tables/RawSubmissionsTable'
import { endpoints } from '../constants/endpoints'
import { Exercise, ExerciseSubmission, Mapping, SubmissionDataRow } from '../constants/types'
import { useExerciseForStaff, useExerciseMaterials } from '../lib/exercise.service'
import { displayTimestamp } from '../lib/utilities.service'
import { AnchorButton } from '../styles/_app.style'
import { Deadline } from '../styles/exercise.style'

const DATA_PLACEHOLDER = '-'

const ExerciseStaff = ({ exercise }: { exercise: Exercise }) => {
  const { year, moduleCode, exerciseNumber } = useParams()
  const { studentLookup, studentSubmissionsLookup, studentGroupsLookup } =
    useExerciseForStaff(exercise)
  const { spec, fileRequirements } = useExerciseMaterials()

  const [tableData, setTableData] = useState<SubmissionDataRow[]>([])
  useEffect(() => {
    const members = new Set(
      Object.values(studentGroupsLookup)
        .flatMap((g) => g.members)
        .filter((m) => !m.isLeader)
        .map((m) => m.username)
    )
    const submitters = new Set(Object.keys(studentSubmissionsLookup))

    let missing: Mapping<string, ExerciseSubmission[]> = Object.keys(studentLookup)
      .filter((s) => !(members.has(s) || submitters.has(s)))
      .reduce((acc, login) => {
        return { ...acc, [login]: [] }
      }, {})
    setTableData(
      Object.entries({ ...studentSubmissionsLookup, ...missing }).map(([leader, submissions]) => {
        return {
          login: leader,
          fullName: studentLookup[leader]?.fullName || DATA_PLACEHOLDER,
          latestSubmission:
            submissions.length > 0
              ? format(submissions[submissions.length - 1].timestamp, 'dd/MM/yy HH:mm:ss')
              : DATA_PLACEHOLDER,
          subRows:
            studentGroupsLookup[leader]?.members
              .filter((m) => !m.isLeader)
              .map(({ username }) => {
                return {
                  login: username,
                  fullName: studentLookup[username]?.fullName || DATA_PLACEHOLDER,
                  latestSubmission: '',
                }
              }) || [],
        }
      })
    )
  }, [studentGroupsLookup, studentLookup, studentSubmissionsLookup])

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Deadline>Due {displayTimestamp(exercise.deadline)}</Deadline>
        <AnchorButton
          href={endpoints.submissionsZipped(year!, moduleCode!, parseInt(exerciseNumber as string))}
          title="Download raw submissions"
        >
          Bulk download
        </AnchorButton>
      </div>
      <div style={{ overflowX: 'scroll' }}>
        <RawSubmissionsTable exercise={exercise} data={tableData} />
      </div>
    </>
  )
}

export default ExerciseStaff
