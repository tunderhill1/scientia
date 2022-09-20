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
  const { year } = useYear()
  const { addToast } = useToast()
  const { userDetails } = useUser()

  const [exerciseMaterials, setExerciseMaterials] = useState<ExerciseMaterials | null>(null)
  const { data: rawExerciseMaterials, error: exerciseMaterialsError } = useAxios({
    url: endpoints.exerciseMaterials(
      `${year}`,
      exercise.moduleCode!,
      exercise.number,
      userDetails!.cohort
    ),
    method: 'GET',
  })
  useEffect(() => {
    if (exerciseMaterialsError) {
      addToast({
        variant: 'error',
        title: 'Error fetching exercise materials',
      })
    }
    if (rawExerciseMaterials) {
      setExerciseMaterials(plainToInstance(ExerciseMaterials, rawExerciseMaterials))
    }
  }, [addToast, exerciseMaterialsError, rawExerciseMaterials])

  const [submittedFiles, setSubmittedFiles] = useState<SubmittedFile[]>([])
  const { data: rawSubmissions, error: submissionsError } = useAxios({
    url: endpoints.submissions(`${year}`, exercise.moduleCode!, exercise.number),
    method: 'GET',
  })
  useEffect(() => {
    if (submissionsError) {
      addToast({
        variant: 'error',
        title: 'Error fetching submitted files',
      })
      console.error(submissionsError)
    }
    if (rawSubmissions) {
      setSubmittedFiles(
        rawSubmissions.map((submittedFile: any) => plainToInstance(SubmittedFile, submittedFile))
      )
    }
  }, [addToast, submissionsError, rawSubmissions])

  const submitFile = ({ file, targetFileName }: { file: File; targetFileName: string }) => {
    let formData = new FormData()
    formData.append('file', new File([file], targetFileName))
    axiosInstance
      .request({
        method: 'POST',
        url: endpoints.submissions(year.toString(), exercise.moduleCode!, exercise.number),
        data: formData,
      })
      .then(({ data }: { data: SubmittedFile }) =>
        setSubmittedFiles((submittedFiles) => [
          ...submittedFiles,
          plainToInstance(SubmittedFile, data),
        ])
      )
      .catch((error: any) => {
        addToast({
          variant: 'error',
          title: "Can't fetch submitted files",
        })
        console.error(error)
      })
  }

  const deleteFile = (file: SubmittedFile) => {
    axiosInstance
      .request({
        method: 'DELETE',
        url: endpoints.submission(year.toString(), file.moduleCode, file.exerciseNumber, file.id),
      })
      .then(() => {
        setSubmittedFiles((submittedFiles) =>
          submittedFiles.filter((submission) => submission.targetFileName !== file.targetFileName)
        )
      })
      .catch((error: any) => {
        addToast({
          variant: 'error',
          title: "Can't delete submitted file",
        })
        console.error(error)
      })
  }

  const submitWorkload = (workload: string) => {
    if (workload === '') return
    axiosInstance.request({
      method: 'POST',
      url: endpoints.submissionWorkload(`${year}`, exercise.moduleCode!, exercise.number),
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
