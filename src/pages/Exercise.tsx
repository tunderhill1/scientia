import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import FileUploadArea from '../components/exercise/FileUploadArea'
import { DefaultGroupArea, GroupManagementArea } from '../components/exercise/GroupManagementArea'
import { useExercise } from '../lib/exercise.service'
import { useGroup } from '../lib/groupFormation.service'
import { useUser } from '../lib/user.context'
import { displayTimestamp, now } from '../lib/utilities.service'
import { Container, Hr, Wrapper } from '../styles/_app.style'
import {
  Deadline,
  Link,
  LinkIcon,
  PlagiarismDisclaimer,
  ProgressBar,
  ResourcesWrapper,
  UploadWrapper,
} from '../styles/exercise.style'
import { css } from '../styles/stitches.config'

const Exercise = () => {
  const { userDetails } = useUser()
  const { moduleCode, exerciseNumber } = useParams()
  const { exercise, exerciseIsLoaded, exerciseMaterials, submittedFiles, submitFile, deleteFile } =
    useExercise()
  const { spec, dataFiles, modelAnswers, fileRequirements } = exerciseMaterials || {}
  const { groupIsLoaded, enrolledStudents, group, createGroup, membersActions } = useGroup(exercise)

  function isUploadEnabled(): boolean {
    function studentCanInteractWithSubmission(): boolean {
      // This is admittedly a hack, but gets easily around the pure date comparison
      // limitations (which would make dev interactions cumbersome)
      const appIsRunningInDev = process.env.NODE_ENV === 'development'
      const isWithinExercisePeriod = now() < exercise!.deadline && now() > exercise!.startDate
      const studentIsLeader =
        exercise!.submissionType === 'individual' || group?.leader === userDetails!.login
      return (appIsRunningInDev || isWithinExercisePeriod) && studentIsLeader
    }

    return !userDetails?.isStaff && studentCanInteractWithSubmission()
  }

  const GroupSection = () => {
    if (!groupIsLoaded) return <Wrapper center>Loading group data...</Wrapper>
    if (!group) return <DefaultGroupArea onCreateGroup={createGroup} />
    return (
      <GroupManagementArea
        group={group}
        enrolledStudents={enrolledStudents}
        membersActions={membersActions}
      />
    )
  }

  if (!exercise || (!spec && !fileRequirements?.length)) {
    return (
      <Container>
        <section style={{ marginBottom: '2rem' }}>
          <h1>
            {moduleCode}: {exerciseNumber}
          </h1>
        </section>
        <Wrapper center>
          <span>
            {!exerciseIsLoaded ? 'Loading exercise...' : 'No information for this exercise.'}
          </span>
        </Wrapper>
      </Container>
    )
  }

  const moduleTitle = userDetails?.modules.find((m) => m.code === exercise.moduleCode)?.title
  return (
    <Container>
      <Helmet>
        <title>
          {moduleCode}/{exerciseNumber}
        </title>
      </Helmet>
      <section style={{ marginBottom: '2rem' }}>
        <h1>
          {exercise.type} {exerciseNumber}: {exercise.title}
        </h1>
        <h3
          className={css({
            color: '$lowContrast',
            margin: '0.5rem 0',
            marginBottom: '1rem',
            fontWeight: '400',
          })()}
        >
          {moduleCode} {moduleTitle}
        </h3>
      </section>

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
          <ResourcesWrapper>
            {spec && (
              <Link target="_blank" href={spec.url}>
                <LinkIcon />
                Specification
              </Link>
            )}
            {!!dataFiles?.length && (
              <Link target="_blank" href={dataFiles[0].url}>
                <LinkIcon />
                Data Files
              </Link>
            )}
            {!!modelAnswers?.length && (
              <Link target="_blank" href={modelAnswers[0].url}>
                <LinkIcon />
                Model Answers
              </Link>
            )}
          </ResourcesWrapper>
          <Hr />
          {exercise.submissionType === 'group' && <GroupSection />}

          {(exercise.submissionType === 'individual' || group) && !!fileRequirements?.length && (
            <>
              <UploadWrapper>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap-reverse',
                    gap: '0.5rem 2rem',
                  }}
                >
                  {!userDetails?.isStaff && (
                    <Deadline css={{ color: '$green11' }}>
                      {submittedFiles.length} out of {fileRequirements.length} submitted
                      {submittedFiles.length === fileRequirements.length && (
                        <>, and you are all done! 🎉</>
                      )}
                    </Deadline>
                  )}
                  <Deadline completed={submittedFiles.length === fileRequirements.length}>
                    Due {displayTimestamp(exercise.deadline)}
                  </Deadline>
                </div>
                <ProgressBar value={submittedFiles.length} max={fileRequirements.length} />
                {fileRequirements.map((fileRequirement, index) => (
                  <FileUploadArea
                    key={index}
                    exercise={exercise}
                    disabled={!isUploadEnabled()}
                    fileRequirement={fileRequirement}
                    submittedFiles={submittedFiles}
                    submitFile={submitFile}
                    deleteFile={deleteFile}
                  />
                ))}
              </UploadWrapper>
              {!!fileRequirements?.length && !userDetails?.isStaff && (
                <PlagiarismDisclaimer>
                  {exercise.isGroup
                    ? "By accepting membership of this group, you agree that this is the group's collective work."
                    : 'By submitting, you agree that this is your own, unaided work.'}
                </PlagiarismDisclaimer>
              )}
            </>
          )}
        </div>
      </>
    </Container>
  )
}

export default Exercise
