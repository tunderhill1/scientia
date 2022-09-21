import confetti from 'canvas-confetti'
import { useEffect } from 'react'

import { Exercise, SetState } from '../../constants/types'
import { useExercise } from '../../lib/exerciseDialog.service'
import { displayTimestamp } from '../../lib/utilities.service'
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

const ExerciseDialog = ({
  exercise,
  setExercise,
}: {
  exercise: Exercise
  setExercise: SetState<Exercise | null>
}) => {
  const { exerciseMaterials, submittedFiles, submitFile, deleteFile } = useExercise(exercise)
  const { spec, dataFiles, modelAnswers, fileRequirements } = exerciseMaterials || {}

  function isUploadEnabled(): boolean {
    // This is admittedly a hack, but gets easily around the pure date comparison
    // limitations (which would make dev interactions cumbersome)
    return process.env.NODE_ENV === 'development' || exercise.endDate > new Date()
  }

  useEffect(() => {
    if (fileRequirements && fileRequirements.length === submittedFiles.length)
      setTimeout(confetti, 330)
    // only show confetti once - when submitted files renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submittedFiles])

  const tempDate = new Date(2022, 8, 30, 19)

  return (
    exercise && (
      <Dialog open={true} onOpenChange={() => setExercise(null)}>
        <TitleWrapper>
          <ExerciseTitle>{exercise.title}</ExerciseTitle>
          <div style={{ gap: '0.5rem', display: 'flex' }}>
            <ModulePill>{exercise.type}</ModulePill>
            <ModulePill>{exercise.moduleName}</ModulePill>
          </div>
        </TitleWrapper>

        {exerciseMaterials ? (
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
                {dataFiles?.length && (
                  <Link target="_blank" href={dataFiles[0].url}>
                    <LinkIcon />
                    Data Files
                  </Link>
                )}
                {modelAnswers?.length && (
                  <Link target="_blank" href={modelAnswers[0].url}>
                    <LinkIcon />
                    Model Answers
                  </Link>
                )}
              </ResourcesWrapper>
              <Hr />
              {fileRequirements?.length && (
                <UploadWrapper>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-end',
                      flexWrap: 'wrap-reverse',
                      gap: '0.5rem',
                    }}
                  >
                    <Deadline css={{ color: '$green11' }}>
                      {submittedFiles.length} out of {fileRequirements.length} submitted
                    </Deadline>
                    <Deadline>Due {displayTimestamp(tempDate)}</Deadline>
                  </div>
                  <ProgressBar value={submittedFiles.length} max={fileRequirements.length} />
                  {fileRequirements.map((fileRequirement, index) => (
                    <FileUploadArea
                      key={index}
                      disabled={!isUploadEnabled()}
                      fileRequirement={fileRequirement}
                      submittedFiles={submittedFiles}
                      submitFile={submitFile}
                      deleteFile={deleteFile}
                    />
                  ))}
                </UploadWrapper>
              )}
            </div>
            {fileRequirements?.length && (
              <PlagiarismDisclaimer>
                By submitting, you agree that this is your own, unaided work.
              </PlagiarismDisclaimer>
            )}
          </>
        ) : (
          <NotFound>No materials found for this exercise.</NotFound>
        )}
      </Dialog>
    )
  )
}

export default ExerciseDialog
