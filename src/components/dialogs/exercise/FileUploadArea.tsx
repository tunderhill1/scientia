import prettyBytes from 'pretty-bytes'
import { useEffect, useState } from 'react'
import { CheckLg, Upload } from 'react-bootstrap-icons'

import { endpoints } from '../../../constants/endpoints'
import { FileRequirement, SubmittedFile } from '../../../constants/types'
import { displayTimestamp } from '../../../lib/utilities.service'
import { UploadTrigger } from '../../../styles/exerciseDialog.style'
import { css } from '../../../styles/stitches.config'
import DeleteButton from './DeleteButton'

const FileUploadArea = ({
  disabled = false,
  fileRequirement,
  submittedFiles,
  submitFile,
  deleteFile,
}: {
  disabled?: boolean
  fileRequirement: FileRequirement
  submittedFiles: SubmittedFile[]
  submitFile: (_: { file: File; targetFileName: string }) => void
  deleteFile: (_: SubmittedFile) => void
}) => {
  const [submittedFile, setSubmittedFile] = useState<SubmittedFile | null>(null)

  useEffect(() => {
    setSubmittedFile(
      submittedFiles?.find(({ targetFileName }) => targetFileName === fileRequirement.name) || null
    )
  }, [fileRequirement, submittedFiles])

  function openSubmissionFile(event: any) {
    if (!submittedFile) return
    event.preventDefault()
    window.open(
      endpoints.submissionFile(
        submittedFile.year,
        submittedFile.moduleCode,
        submittedFile.exerciseNumber,
        submittedFile.targetFileName,
        submittedFile.id
      ),
      '_blank'
    )
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <UploadTrigger
        htmlFor={`exercise-upload-${fileRequirement.name}`}
        onClick={openSubmissionFile}
        className={css({
          backgroundColor: submittedFile ? '$green5' : '$elementBackground',
          '&:hover': { backgroundColor: submittedFile ? '$green6' : '$elementHover' },
        })()}
      >
        <div style={{ display: 'flex' }}>
          {submittedFile ? <CheckLg size={22} /> : <Upload size={22} />}
          <p>&emsp;{fileRequirement.name}</p>
        </div>
        {submittedFile && (
          <div style={{ display: 'flex', flexDirection: 'column', marginRight: '1rem' }}>
            <p>{displayTimestamp(submittedFile.timestamp)}</p>
            <p className={css({ fontSize: '0.875rem', color: '$sand9' })()}>
              {prettyBytes(submittedFile.fileSize)}
            </p>
          </div>
        )}
      </UploadTrigger>

      {submittedFile && (
        <DeleteButton
          name={submittedFile.targetFileName}
          style={{ marginLeft: '1rem' }}
          deleteFile={() => deleteFile(submittedFile)}
        />
      )}
      <input
        hidden
        type="file"
        disabled={disabled || !!submittedFile}
        id={`exercise-upload-${fileRequirement.name}`}
        accept={fileRequirement.name.slice(fileRequirement.name.indexOf('.'))}
        onChange={(event) => {
          if (disabled || !event.target.files) return
          submitFile({
            file: event.target.files[0],
            targetFileName: fileRequirement.name,
          })
          // Fixes Chrome and Firefox upload issue.
          // see: https://stackoverflow.com/a/25948969/10564311
          event.target.value = ''
          return false
        }}
      />
    </div>
  )
}
export default FileUploadArea
