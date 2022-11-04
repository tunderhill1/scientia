import { Exercise, SetState } from '../../constants/types'
import { useExercise } from '../../lib/exerciseDialog.service'
import { useGroup } from '../../lib/groupSubmission.service'
import { useUser } from '../../lib/user.context'
import { displayTimestamp, now } from '../../lib/utilities.service'
import { Wrapper } from '../../styles/_app.style'
import {
  Deadline,
  ExerciseTitle,
  Hr,
  Link,
  LinkIcon,
  ModulePill,
  NotFound,
  PlagiarismDisclaimer,
  ProgressBar,
  ResourcesWrapper,
  TitleWrapper,
  UploadWrapper,
} from '../../styles/exerciseDialog.style'
import Dialog from './Dialog'
import FileUploadArea from './exercise/FileUploadArea'
import { DefaultGroupArea, GroupManagementArea } from './exercise/GroupManagementArea'

const ExerciseDialog = ({
  exercise,
  setExercise,
}: {
  exercise: Exercise
  setExercise: SetState<Exercise | null>
}) => {
  const { exerciseMaterials, submittedFiles, submitFile, deleteFile } = useExercise(exercise)
  const { spec, dataFiles, modelAnswers, fileRequirements } = exerciseMaterials || {}
  const { userDetails } = useUser()
  const moduleName = userDetails?.modules.find((m) => m.code === exercise.moduleCode)?.title
  const { groupIsLoaded, enrolledStudents, group, createGroup, membersActions } = useGroup(exercise)

  function isUploadEnabled(): boolean {
    function studentCanInteractWithSubmission(): boolean {
      // This is admittedly a hack, but gets easily around the pure date comparison
      // limitations (which would make dev interactions cumbersome)
      const appIsRunningInDev = process.env.NODE_ENV === 'development'
      const isWithinExercisePeriod = now() < exercise.deadline && now() > exercise.startDate
      const studentIsLeader =
        exercise.submissionType === 'individual' || group?.leader === userDetails!.login
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

  return (
    exercise && (
      <Dialog open={true} onOpenChange={() => setExercise(null)}>
        <TitleWrapper>
          <ExerciseTitle>{exercise.title}</ExerciseTitle>
          <div style={{ gap: '0.5rem', display: 'flex' }}>
            <ModulePill>{exercise.type}</ModulePill>
            {moduleName && <ModulePill>{moduleName}</ModulePill>}
          </div>
        </TitleWrapper>

        {!spec && !dataFiles?.length && !modelAnswers?.length && !fileRequirements?.length ? (
          <NotFound>No materials found for this exercise.</NotFound>
        ) : (
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
        )}
      </Dialog>
    )
  )
}

export default ExerciseDialog
