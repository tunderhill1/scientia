import { formatInTimeZone } from 'date-fns-tz'
import prettyBytes from 'pretty-bytes'
import { useEffect, useState } from 'react'
import { BoxArrowUpRight, CheckLg, Envelope, FileEarmark, Upload } from 'react-bootstrap-icons'

import { LONDON_TIMEZONE } from '../../constants/global'
import { Exercise, Module } from '../../constants/types'
import { useExercises } from '../../lib/exercises.service'
import { currentShortYear } from '../../lib/utilities.service'
import {
  ModulePill,
  SpecLink,
  TrashButton,
  UploadButton,
  UploadWrapper,
} from '../../styles/exerciseDialog.style'
import { Tabs } from '../Tabs'
import Dialog from './Dialog'

export interface FileToSubmit {
  name: string
  suffix: string[]
  max_size: number
  url?: string
  size?: number
  file?: File
  timestamp?: Date
}

const ExerciseDialog = ({
  open,
  onOpenChange,
  exercise,
  module,
}: {
  open: boolean
  onOpenChange: (_: boolean) => void
  exercise: Exercise
  module: Module
}) => {
  const { getExerciseMaterials, deleteFile, submitFile } = useExercises()

  interface Material {
    name: string
    suffix: string[]
    url: string
  }

  interface ExerciseOwner {
    shortcode: string
    email: string
    name: string | null
  }

  const [exerciseMaterials, setExerciseMaterials] = useState<any | null>(null)
  const [spec, setSpec] = useState<Material | null>(null)
  const [modelAnswers, setModelAnswers] = useState<Material[]>([])
  const [dataFiles, setDataFiles] = useState<Material[]>([])
  const [filesToSubmit, setFilesToSubmit] = useState<FileToSubmit[]>([])
  const [owner, setOwner] = useState<ExerciseOwner | null>(null)

  useEffect(() => {
    getExerciseMaterials({
      academicYear: currentShortYear(),
      yearGroup: 'c1',
      exerciseId: exercise.number,
      setExerciseMaterials,
    })
  }, [exercise])

  useEffect(() => {
    console.log({ exerciseMaterials })
    if (!exerciseMaterials) return
    setSpec(exerciseMaterials.spec)
    setModelAnswers(exerciseMaterials.model_answers)
    setDataFiles(exerciseMaterials.data_files)
    setFilesToSubmit(exerciseMaterials.hand_ins)
    setOwner(exerciseMaterials.owner)
  }, [exerciseMaterials])

  // Date format: https://date-fns.org/v2.29.1/docs/format
  const formatTimestamp = (date: Date | string) =>
    formatInTimeZone(date, LONDON_TIMEZONE, 'E d LLL yyyy, h:mm aaa zzz')

  return (
    <Dialog {...{ open, onOpenChange }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h3>
          {exercise.type}: {exercise.title}
        </h3>
        {owner && (
          <address style={{ float: 'right' }}>
            <a
              title={
                'Email the exercise owner' +
                (owner.name ? `: ${owner.name} (${owner.shortcode})` : '')
              }
              href={`mailto:${owner.email}`}
            >
              <Envelope size={24} />
            </a>
          </address>
        )}
      </div>
      <ModulePill>
        {exercise.moduleCode}: {module.title}
      </ModulePill>
      {/* TODO: spec button placement not final - temporarily placed in centre. */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        {spec && (
          <SpecLink target="_blank" href={spec.url}>
            <BoxArrowUpRight
              style={{ marginRight: '0.5rem', fill: 'inherit', float: 'left' }}
              size={16}
              fill="#1B1B18"
            />
            View specification
          </SpecLink>
        )}
      </div>
      {/* convert tabs to <a href=""></a> */}
      <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'row' }}>
        {dataFiles.length !== 0 && (
          <div
            style={{
              width: modelAnswers.length !== 0 ? '50%' : '100%',
              textAlign: 'center',
            }}
          >
            <h4>Data files</h4>
            <Tabs
              data={dataFiles}
              generator={(tab: any) => (
                <span style={{ textAlign: 'center', width: '100%' }}>
                  {tab.name}.{tab.suffix[0]}
                </span>
              )}
              onClick={(tab: any) => window.open(tab.url)}
            />
          </div>
        )}
        {modelAnswers.length !== 0 && (
          <div
            style={{
              width: modelAnswers.length !== 0 ? '50%' : '100%',
              textAlign: 'center',
            }}
          >
            <h4>Model answers</h4>
            <Tabs
              data={modelAnswers}
              generator={(tab: any) => (
                <span style={{ textAlign: 'center', width: '100%' }}>
                  {tab.name}.{tab.suffix[0]}
                </span>
              )}
              onClick={(tab: any) => window.open(tab.url)}
            />
          </div>
        )}
      </div>
      {filesToSubmit.length > 0 && (
        <div style={{ marginTop: '1rem' }}>
          <h4>Submission</h4>
          <p style={{ fontSize: '14px', color: '$sand8' }}>
            Deadline: {formatTimestamp(exercise.endDate)}
          </p>
          <UploadWrapper>
            {filesToSubmit.map((file, fileIndex) => (
              <div
                key={fileIndex}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  verticalAlign: 'middle',
                }}
              >
                <UploadButton
                  css={{
                    backgroundColor: '$sand1',
                    filter:
                      'drop-shadow(0 1px 2px rgba(0,0,0,.06)) drop-shadow(0 1px 3px rgba(0,0,0,.1))',
                    marginTop: '1rem',
                  }}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    width: '100%',
                  }}
                  htmlFor={`file-upload-${fileIndex}`}
                >
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'center',
                    }}
                  >
                    {file.file ? (
                      <CheckLg
                        size={24}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                      />
                    ) : (
                      <FileEarmark
                        size={24}
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                        }}
                      />
                    )}
                    <div
                      style={{
                        marginLeft: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <p>{file.name}</p>
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: '#8F908C', // = $sand9
                        }}
                      >
                        {'.' + file.suffix.join(', .')}
                      </p>
                    </div>
                  </div>
                  {file.file ? (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                      }}
                    >
                      <p>{file.file?.name}</p>
                      <p
                        style={{
                          fontSize: '0.8rem',
                          color: '#8F908C', // = $sand9
                        }}
                      >
                        {`${file.timestamp && formatTimestamp(file.timestamp) + '•'} ${prettyBytes(
                          file.file.size
                        )}`}
                      </p>
                    </div>
                  ) : (
                    <Upload size={24} />
                  )}
                  {file.file && (
                    <TrashButton
                      size={24}
                      style={{ fontSize: '1rem' }}
                      onClick={(event) => {
                        // TODO: tell server to delete submission
                        deleteFile(file)
                        console.log({ filesToSubmit })
                        setFilesToSubmit((filesToSubmit: any) =>
                          filesToSubmit.map((fileToSubmit: any, index: number) =>
                            index === fileIndex
                              ? { ...fileToSubmit, file: undefined }
                              : fileToSubmit
                          )
                        )
                        event.preventDefault()
                      }}
                    />
                  )}
                </UploadButton>

                <input
                  type="file"
                  onChange={(event) => {
                    console.log(event.target)
                    // TODO: on cancel of file browser: dont remove submission
                    if (event.target.files === null) return
                    // if (exercise.endDate > new Date()) return
                    submitFile(event.target.files[0])
                    setFilesToSubmit((filesToSubmit: FileToSubmit[]) =>
                      filesToSubmit.map((fileToSubmit, index) =>
                        index === fileIndex
                          ? {
                              ...fileToSubmit,
                              file: event.target.files![0],
                              timestamp: new Date(),
                            }
                          : fileToSubmit
                      )
                    )
                    console.log(event.target.files[0])
                  }}
                  // disabled={exercise.endDate > new Date()}
                  accept={'.' + file.suffix.join(', .')}
                  id={`file-upload-${fileIndex}`}
                  hidden
                />
              </div>
            ))}
          </UploadWrapper>
          <p style={{ fontSize: '0.8rem', marginTop: '1rem' }}>
            By uploading, you agree that this is your own, unaided work.
          </p>

          <div style={{ display: 'flex', fontSize: '0.8rem', marginTop: '1rem' }}>
            <p>How many hours did this coursework take you?</p>
            <input style={{ display: 'inline', marginLeft: '0.5rem' }} />
          </div>
        </div>
      )}
    </Dialog>
  )
}

export default ExerciseDialog
