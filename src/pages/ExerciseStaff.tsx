import { format } from 'date-fns'
import React, { useEffect, useState } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import PagePlaceholder from '../components/PagePlaceholder'
import ExerciseMaterialsSection from '../components/exercise/ExerciseMaterialsSection'
import RawSubmissionsTable from '../components/tables/RawSubmissionsTable'
import { endpoints } from '../constants/endpoints'
import titles from '../constants/titles'
import { ExerciseSubmission, Mapping, SubmissionDataRow } from '../constants/types'
import { useExerciseForStaff } from '../lib/exercise.service'
import { useUser } from '../lib/user.context'
import { displayTimestamp } from '../lib/utilities.service'
import { AnchorButton, Container, Hr } from '../styles/_app.style'
import { Deadline, Link } from '../styles/exercise.style'
import { css } from '../styles/stitches.config'

const DATA_PLACEHOLDER = '-'

const ExerciseStaff = () => {
  const { year, moduleCode, exerciseNumber } = useParams()
  const { userDetails } = useUser()
  const {
    exercise,
    exerciseIsLoaded,
    exerciseMaterials,
    studentLookup,
    studentSubmissionsLookup,
    studentGroupsLookup,
  } = useExerciseForStaff()
  const { spec, dataFiles, modelAnswers, fileRequirements } = exerciseMaterials
  const pageTitle = titles.exercise(year, exercise, moduleCode, exerciseNumber)

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

  if (!exercise || (!spec && !fileRequirements?.length && !exercise.isGroupFormation)) {
    return (
      <PagePlaceholder
        title={pageTitle}
        header={`${moduleCode}: ${exerciseNumber}`}
        loading={!exerciseIsLoaded}
        loadingText={'Loading exercise...'}
        noInfoText={'No information for this exercise.'}
      />
    )
  }

  const moduleTitle = userDetails?.modules.find((m) => m.code === exercise.moduleCode)?.title

  return (
    <Container>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>

      <>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            flexWrap: 'wrap',
            gap: '2rem',
          }}
        >
          <section>
            <h1>
              {exercise.type} {exerciseNumber}: {exercise.title}
            </h1>
            <Link
              href={`/${year}/modules/${moduleCode}/materials`}
              css={{ textDecoration: 'none' }}
            >
              <h3
                className={css({
                  color: '$lowContrast',
                  fontWeight: '400',
                })()}
              >
                {moduleCode} {moduleTitle}
              </h3>
            </Link>
          </section>
          {spec && (
            <ExerciseMaterialsSection
              spec={spec}
              dataFiles={dataFiles}
              modelAnswers={modelAnswers}
            />
          )}
          <Hr />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Deadline>Due {displayTimestamp(exercise.deadline)}</Deadline>
            <AnchorButton
              href={endpoints.submissionsZipped(
                year!,
                moduleCode!,
                parseInt(exerciseNumber as string)
              )}
              title="Download raw submissions"
            >
              Bulk download
            </AnchorButton>
          </div>
          <div style={{ overflowX: 'scroll' }}>
            <RawSubmissionsTable exercise={exercise} data={tableData} />
          </div>
        </div>
      </>
    </Container>
  )
}

export default ExerciseStaff
