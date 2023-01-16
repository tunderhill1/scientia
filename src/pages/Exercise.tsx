import { useEffect } from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import FileUploadArea from '../components/exercise/FileUploadArea'
import { DefaultGroupArea, GroupManagementArea } from '../components/exercise/GroupManagementArea'
import { GRACE_PERIOD_AFTER_DEADLINE_IN_DAYS } from '../constants/global'
import titles from '../constants/titles'
import { useExercise } from '../lib/exercise.service'
import { useGroup } from '../lib/groupFormation.service'
import { useUser } from '../lib/user.context'
import { displayTimestamp, now } from '../lib/utilities.service'
import { Banner, Container, Hr } from '../styles/_app.style'
import {
  Deadline,
  Footer,
  Link,
  LinkIcon,
  ProgressBar,
  ResourcesWrapper,
  UploadWrapper,
} from '../styles/exercise.style'
import { css } from '../styles/stitches.config'

const Exercise = () => {
  const { year, moduleCode, exerciseNumber } = useParams()
  const { userDetails } = useUser()
  const {
    exercise,
    exerciseIsLoaded,
    exerciseMaterials,
    submittedFiles,
    submitFile,
    deleteFile,
    loadSubmittedFiles,
  } = useExercise()
  const { spec, dataFiles, modelAnswers, fileRequirements } = exerciseMaterials || {}
  const { groupIsLoaded, enrolledStudents, group, createGroup, membersActions } = useGroup(exercise)

  useEffect(() => {
    if (!exercise) return
    loadSubmittedFiles()
  }, [exercise, group, loadSubmittedFiles])

  function studentIsLeader(): boolean {
    return exercise!.submissionType === 'individual' || group?.leader === userDetails!.login
  }

  function exerciseIsOpen(): boolean {
    // This is admittedly a hack, but gets easily around the pure date comparison
    // limitations (which would make dev interactions cumbersome)
    const appIsRunningInDev = process.env.NODE_ENV === 'development'
    const isWithinExercisePeriod =
      now() < exercise!.latePeriodDeadline && now() > exercise!.startDate
    return !userDetails?.isStaff && (appIsRunningInDev || isWithinExercisePeriod)
  }

  const SubmissionUploadAvailabilityWarning = () => {
    if (now() < exercise!.latePeriodDeadline)
      return (
        <Banner center level={'warning'}>
          <p>
            Your deadline has passed.
            <br /> Further modifications to your work will be classified as <b>late</b>.
          </p>
        </Banner>
      )
    return (
      <Banner center>
        <p>
          You are more than {GRACE_PERIOD_AFTER_DEADLINE_IN_DAYS} days past your deadline. <br />
          No further modifications to your work are possible.
        </p>
      </Banner>
    )
  }

  const ExerciseMaterialsSection = () => {
    return (
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
    )
  }

  const GroupSection = () => {
    if (!group) {
      if (!exerciseIsOpen()) return <></>
      if (!groupIsLoaded) return <Banner center>Loading group data...</Banner>
      return <DefaultGroupArea onCreateGroup={createGroup} />
    }
    return (
      <GroupManagementArea
        group={group}
        enrolledStudents={enrolledStudents}
        membersActions={membersActions}
        disabled={!exerciseIsOpen()}
      />
    )
  }

  if (!exercise || (!spec && !fileRequirements?.length && !exercise.isGroupFormation)) {
    return (
      <Container>
        <Helmet>
          <title>{titles.exercise(year, exercise, moduleCode, exerciseNumber)}</title>
        </Helmet>
        <section style={{ marginBottom: '2rem' }}>
          <h1>
            {moduleCode}: {exerciseNumber}
          </h1>
        </section>
        <Banner center>
          <span>
            {!exerciseIsLoaded ? 'Loading exercise...' : 'No information for this exercise.'}
          </span>
        </Banner>
      </Container>
    )
  }

  const moduleTitle = userDetails?.modules.find((m) => m.code === exercise.moduleCode)?.title

  const FooterMessage = () => {
    const GROUP_FORMATION_FOOTER =
      'This is a group formation exercise. No file nor code submission is expected.'
    const GROUP_SUBMISSION_FOOTER =
      "By accepting membership of this group, you agree that this is the group's collective work."
    const INDIVIDUAL_SUBMISSION_FOOTER =
      'By submitting, you agree that this is your own, unaided work.'

    return (
      <Footer>
        {exercise.isGroupFormation
          ? GROUP_FORMATION_FOOTER
          : exercise.isGroup
          ? GROUP_SUBMISSION_FOOTER
          : INDIVIDUAL_SUBMISSION_FOOTER}
      </Footer>
    )
  }

  return (
    <Container>
      <Helmet>
        <title>{titles.exercise(year, exercise, moduleCode, exerciseNumber)}</title>
      </Helmet>
      <section style={{ marginBottom: '2rem' }}>
        <h1>
          {exercise.type} {exerciseNumber}: {exercise.title}
        </h1>
        <Link href={`/${year}/modules/${moduleCode}/materials`} css={{ textDecoration: 'none' }}>
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
        </Link>
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
          <ExerciseMaterialsSection />
          <Hr />
          <Deadline>Due {displayTimestamp(exercise.deadline)}</Deadline>

          {now() > exercise.deadline && <SubmissionUploadAvailabilityWarning />}
          {exercise.submissionType === 'group' && <GroupSection />}

          {(exercise.submissionType === 'individual' || group) && (
            <>
              {!!fileRequirements?.length && (
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
                  </div>
                  <ProgressBar value={submittedFiles.length} max={fileRequirements.length} />
                  {fileRequirements.map((fileRequirement, index) => (
                    <FileUploadArea
                      key={index}
                      exercise={exercise}
                      disabled={!(exerciseIsOpen() && studentIsLeader())}
                      fileRequirement={fileRequirement}
                      submittedFiles={submittedFiles}
                      submitFile={submitFile}
                      deleteFile={deleteFile}
                    />
                  ))}
                </UploadWrapper>
              )}
              {(!!fileRequirements?.length || exercise.isGroupFormation) && <FooterMessage />}
            </>
          )}
        </div>
      </>
    </Container>
  )
}

export default Exercise
