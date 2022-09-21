import { plainToInstance } from 'class-transformer'
import { useContext, useEffect, useState } from 'react'

import { endpoints } from '../constants/endpoints'
import { Exercise, ExerciseMaterials, SubmittedFile } from '../constants/types'
import { AxiosContext, useAxios } from './axios.context'
import { useToast } from './toast.context'
import { useUser } from './user.context'
import { useYear } from './year.context'

export const useExercise = (exercise: Exercise) => {
  const axiosInstance = useContext(AxiosContext)
  const { addToast } = useToast()
  const { userDetails } = useUser()
  const { year } = useYear()

  const [exerciseMaterials, setExerciseMaterials] = useState<ExerciseMaterials | null>(null)
  const { data: rawExerciseMaterials, error: exerciseMaterialsError } = useAxios({
    method: 'GET',
    url: endpoints.exerciseMaterials(
      year,
      exercise.moduleCode,
      exercise.number,
      userDetails!.cohort
    ),
  })
  useEffect(() => {
    if (exerciseMaterialsError) {
      addToast({
        variant: 'error',
        title: 'Unable to get exercise details',
      })
    } else if (rawExerciseMaterials) {
      setExerciseMaterials(plainToInstance(ExerciseMaterials, rawExerciseMaterials))
    }
  }, [addToast, exerciseMaterialsError, rawExerciseMaterials])

  const [submittedFiles, setSubmittedFiles] = useState<SubmittedFile[]>([])
  const { data: rawSubmissions, error: submissionsError } = useAxios({
    method: 'GET',
    url: endpoints.submissions(year, exercise.moduleCode, exercise.number),
  })
  useEffect(() => {
    if (submissionsError) {
      addToast({
        variant: 'error',
        title: 'Error fetching submitted files',
      })
    } else if (rawSubmissions) {
      setSubmittedFiles(
        rawSubmissions.map((submittedFile: any) => plainToInstance(SubmittedFile, submittedFile))
      )
    }
  }, [addToast, submissionsError, rawSubmissions])

  const submitFile = (file: File, targetFileName: string) => {
    let formData = new FormData()
    formData.append('file', new File([file], targetFileName))
    axiosInstance
      .request({
        method: 'POST',
        url: endpoints.submissions(year, exercise.moduleCode, exercise.number),
        data: formData,
      })
      .then(({ data }: { data: SubmittedFile }) => {
        const submittedFile = plainToInstance(SubmittedFile, data)
        addToast({
          variant: 'success',
          title: `${targetFileName} submitted successfully.`,
        })
        setSubmittedFiles((prevFiles) => [
          ...prevFiles.filter((file) => file.targetFileName !== targetFileName),
          submittedFile,
        ])
      })
      .catch((error: any) => {
        addToast({
          variant: 'error',
          title: 'Error submitting file.',
        })
      })
  }

  const deleteFile = (file: SubmittedFile) => {
    axiosInstance
      .request({
        method: 'DELETE',
        url: endpoints.submission(year, file.moduleCode, file.exerciseNumber, file.id),
      })
      .then(() => {
        addToast({ variant: 'info', title: `File deleted successfully.` })
        setSubmittedFiles((submittedFiles) =>
          submittedFiles.filter((submission) => submission.targetFileName !== file.targetFileName)
        )
      })
      .catch((error: any) => {
        addToast({ variant: 'error', title: "Can't delete submitted file" })
      })
  }

  const submitWorkload = (workload: string) => {
    if (workload === '') return
    axiosInstance.request({
      method: 'POST',
      url: endpoints.submissionWorkload(year, exercise.moduleCode, exercise.number),
      params: { workload },
    })
  }

  return {
    exerciseMaterials,
    submittedFiles,
    submitFile,
    deleteFile,
    submitWorkload,
  }
}
