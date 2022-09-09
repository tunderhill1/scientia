import { Exercise, SetState } from '../../constants/types'
import { useExercise } from '../../lib/exerciseDialog.service'
import { displayTimestamp } from '../../lib/utilities.service'
import {
  Deadline,
  EmailAddress,
  EmailButton,
  ExerciseTitle,
  LinkIcon,
  ModulePill,
  NotFound,
  PlagiarismDisclaimer,
  ResourcesWrapper,
  SpecLink,
  SubmissionWrapper,
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

  return (
    exercise && (
      <Dialog open={true} onOpenChange={() => setExercise(null)}>
        <TitleWrapper>
          <ExerciseTitle>
            {exercise.type}: {exercise.title}
          </ExerciseTitle>
          <EmailAddress>
            <a title={`Email the exercise owner`} href={`mailto:${exercise.owner}@ic.ac.uk`}>
              <EmailButton size={24} />
            </a>
          </EmailAddress>
        </TitleWrapper>
        <ModulePill>
          {exercise.moduleCode}: {exercise.moduleName}
        </ModulePill>
        {!exerciseMaterials && <NotFound>No materials found for this exercise.</NotFound>}

        <ResourcesWrapper>
          {spec && (
            <SpecLink target="_blank" href={spec.url}>
              <LinkIcon size={18} />
              Specification
            </SpecLink>
          )}
          {dataFiles && dataFiles.length > 0 && (
            <SpecLink target="_blank" href={dataFiles[0].url}>
              <LinkIcon size={18} />
              Data Files
            </SpecLink>
          )}
          {modelAnswers && modelAnswers.length > 0 && (
            <SpecLink target="_blank" href={modelAnswers[0].url}>
              <LinkIcon size={18} />
              Model Answers
            </SpecLink>
          )}
        </ResourcesWrapper>

        {fileRequirements && fileRequirements.length > 0 && (
          <SubmissionWrapper>
            <h4>
              Submission ({submittedFiles?.length || 0}/{fileRequirements.length})
              {submittedFiles?.length === fileRequirements.length && ': you are all done! 🎉'}
            </h4>
            <Deadline>Deadline: {displayTimestamp(exercise.endDate)}</Deadline>
            <UploadWrapper>
              {fileRequirements.map((fileRequirement, index: number) => (
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
            <PlagiarismDisclaimer>
              By uploading, you agree that this is your own, unaided work.
            </PlagiarismDisclaimer>
          </SubmissionWrapper>
        )}
      </Dialog>
    )
  )
}

export default ExerciseDialog
