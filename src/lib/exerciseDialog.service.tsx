import confetti from 'canvas-confetti'
import { plainToInstance } from 'class-transformer'
import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { endpoints } from '../constants/endpoints'
import { Exercise, ExerciseMaterials, SubmittedFile } from '../constants/types'
import { AxiosContext } from './axios.context'
import { useToast } from './toast.context'
import { useUser } from './user.context'

export const useExercise = ({ moduleCode, number: exerciseNumber }: Exercise) => {
  const axiosInstance = useContext(AxiosContext)
  const { year } = useParams()
  const { addToast } = useToast()
  const { userDetails } = useUser()

  const [exerciseMaterials, setExerciseMaterials] = useState<ExerciseMaterials | null>(null)
  useEffect(() => {
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.exerciseMaterials(year!, moduleCode, exerciseNumber, userDetails!.cohort),
      })
      .then(({ data }: { data: any }) => {
        setExerciseMaterials(plainToInstance(ExerciseMaterials, data))
      })
      .catch(() => addToast({ variant: 'error', title: 'Unable to get exercise details' }))
  }, [year])

  const [submittedFiles, setSubmittedFiles] = useState<SubmittedFile[]>([])
  useEffect(() => {
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.submissions(year!, moduleCode, exerciseNumber),
      })
      .then(({ data }: { data: any }) => {
        setSubmittedFiles(
          data.map((submittedFile: any) => plainToInstance(SubmittedFile, submittedFile))
        )
      })
      .catch(() => {
        addToast({ variant: 'error', title: 'Error fetching submitted files' })
      })
  }, [year])

  const submitFile = (file: File, targetFileName: string) => {
    let formData = new FormData()
    formData.append('file', new File([file], targetFileName))
    axiosInstance
      .request({
        method: 'POST',
        url: endpoints.submissions(year!, moduleCode, exerciseNumber),
        data: formData,
      })
      .then(({ data }: { data: SubmittedFile }) => {
        const submittedFile = plainToInstance(SubmittedFile, data)
        addToast({
          variant: 'success',
          title: `${targetFileName} submitted successfully.`,
        })
        if (
          exerciseMaterials?.fileRequirements?.length &&
          exerciseMaterials?.fileRequirements.length === submittedFiles.length + 1
        )
          setTimeout(confetti, 330)
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
        url: endpoints.submission(year!, file.moduleCode, file.exerciseNumber, file.id),
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
      url: endpoints.submissionWorkload(year!, moduleCode, exerciseNumber),
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
