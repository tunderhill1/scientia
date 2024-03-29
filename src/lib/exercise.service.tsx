import confetti from 'canvas-confetti'
import { plainToInstance } from 'class-transformer'
import { useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { endpoints } from '../constants/endpoints'
import { Mapping } from '../types/global'
import { EnrolledStudent, Exercise, ExerciseMaterials } from '../types/schemas/abc'
import { ExerciseSubmission, Group, Mark } from '../types/schemas/emarking'
import { AxiosContext } from './axios.context'
import { useToast } from './toast.context'
import { useUser } from './user.context'
import { groupByProperty } from './utilities.service'

const defaultExerciseMaterials = {
  spec: null,
  dataFiles: [],
  modelAnswers: [],
  fileRequirements: [],
}

export const useExerciseMaterials = () => {
  const axiosInstance = useContext(AxiosContext)
  const { year, moduleCode, exerciseNumber } = useParams()
  const { addToast } = useToast()
  const { userDetails } = useUser()

  const [exerciseMaterials, setExerciseMaterials] =
    useState<ExerciseMaterials>(defaultExerciseMaterials)
  useEffect(() => {
    if (!userDetails) return
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.exerciseMaterials(
          year!,
          moduleCode!,
          parseInt(exerciseNumber!),
          userDetails.cohort
        ),
      })
      .then(({ data }: { data: any }) => {
        setExerciseMaterials(plainToInstance(ExerciseMaterials, data))
      })
      .catch(() => addToast({ variant: 'error', title: 'Unable to get exercise details' }))
  }, [addToast, axiosInstance, exerciseNumber, moduleCode, userDetails, year])

  return exerciseMaterials
}

export const useExercise = () => {
  const axiosInstance = useContext(AxiosContext)
  const { year, moduleCode, exerciseNumber } = useParams()
  const { addToast } = useToast()
  const [exercise, setExercise] = useState<Exercise>()
  const [exerciseIsLoaded, setExerciseIsLoaded] = useState<boolean>(false)
  useEffect(() => {
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.exercise(year!, moduleCode!, parseInt(exerciseNumber!)),
      })
      .then(({ data }: { data: any }) => {
        setExercise(plainToInstance(Exercise, data))
      })
      .catch(() => addToast({ variant: 'error', title: 'Unable to fetch exercise' }))
      .finally(() => setExerciseIsLoaded(true))
  }, [addToast, axiosInstance, exerciseNumber, moduleCode, year])

  return { exercise, exerciseIsLoaded }
}

export const useExerciseForStudent = (exercise: Exercise) => {
  const axiosInstance = useContext(AxiosContext)
  const { year, moduleCode, exerciseNumber } = useParams()
  const { addToast } = useToast()

  const [submittedFiles, setSubmittedFiles] = useState<ExerciseSubmission[]>([])
  const loadSubmittedFiles = useCallback(() => {
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.submissions(year!, moduleCode!, parseInt(exerciseNumber!)),
      })
      .then(({ data }: { data: any }) => {
        setSubmittedFiles(
          data.map((submittedFile: any) => plainToInstance(ExerciseSubmission, submittedFile))
        )
      })
      .catch(() => {
        addToast({ variant: 'error', title: 'Error fetching submitted files' })
      })
  }, [addToast, axiosInstance, exerciseNumber, moduleCode, year])

  const submitFile = (totalFilesToSubmit: number) => (file: File, targetFileName: string) => {
    let formData = new FormData()
    formData.append('file', new File([file], targetFileName))
    axiosInstance
      .request({
        method: 'POST',
        url: endpoints.submissions(year!, moduleCode!, parseInt(exerciseNumber!)),
        data: formData,
      })
      .then(({ data }: { data: ExerciseSubmission }) => {
        const submittedFile = plainToInstance(ExerciseSubmission, data)
        addToast({
          variant: 'success',
          title: `${targetFileName} submitted successfully.`,
        })
        if (totalFilesToSubmit === submittedFiles.length + 1) setTimeout(confetti, 330)
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

  const deleteFile = (file: ExerciseSubmission) => {
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
      url: endpoints.submissionWorkload(year!, moduleCode!, parseInt(exerciseNumber!)),
      params: { workload },
    })
  }

  return {
    submittedFiles,
    submitFile,
    deleteFile,
    submitWorkload,
    loadSubmittedFiles,
  }
}

export const useExerciseForStaff = (exercise: Exercise) => {
  const axiosInstance = useContext(AxiosContext)
  const { year, moduleCode, exerciseNumber } = useParams()
  const { addToast } = useToast()
  const { userDetails } = useUser()

  const [enrolledStudents, setEnrolledStudents] = useState<EnrolledStudent[]>([])
  const [studentLookup, setStudentLookup] = useState<Mapping<string, EnrolledStudent>>({})
  useEffect(() => {
    if (!userDetails) return
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.enrolledStudents(year!, moduleCode!),
      })
      .then(({ data }: { data: any }) => {
        let enrolled = data.map((d: any) => plainToInstance(EnrolledStudent, d))
        setEnrolledStudents(enrolled)
        setStudentLookup(
          enrolled.reduce((acc: Mapping<string, EnrolledStudent>, student: EnrolledStudent) => {
            return { ...acc, [student.login]: student }
          }, {})
        )
      })
      .catch(() => addToast({ variant: 'error', title: 'Unable to get enrolled students' }))
  }, [addToast, axiosInstance, exerciseNumber, moduleCode, userDetails, year])

  const [studentSubmissionsLookup, setStudentSubmissionsLookup] = useState<
    Mapping<string, ExerciseSubmission[]>
  >({})
  useEffect(() => {
    if (!userDetails) return
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.submissionsForStaff(year!, moduleCode!, parseInt(exerciseNumber!)),
      })
      .then(({ data }: { data: any }) => {
        let deserialisedData = data.map((d: any) => plainToInstance(ExerciseSubmission, d))
        setStudentSubmissionsLookup(
          groupByProperty(deserialisedData, 'username', 'timestamp') as {
            [username: string]: ExerciseSubmission[]
          }
        )
      })
      .catch(() => addToast({ variant: 'error', title: 'Unable to get student submissions' }))
  }, [addToast, axiosInstance, exerciseNumber, moduleCode, userDetails, year])

  const [studentGroupsLookup, setStudentGroupsLookup] = useState<Mapping<string, Group>>({})
  useEffect(() => {
    if (!userDetails) return
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.submissionGroups,
        params: {
          year,
          module_code: moduleCode,
          exercise_number: exerciseNumber,
        },
      })
      .then(({ data }: { data: any }) => {
        const deserialised = data.map((d: any) => plainToInstance(Group, d))
        const groupsByLeader = deserialised.reduce(
          (grouped: Mapping<string, Group>, group: Group) => {
            return { ...grouped, [group.leader as string]: group }
          },
          {}
        )
        setStudentGroupsLookup(groupsByLeader)
      })
      .catch((error) => {
        console.log(error)
        addToast({ variant: 'error', title: 'Failed to fetch groups' })
      })
  }, [addToast, axiosInstance, exerciseNumber, moduleCode, userDetails, year])

  const [marksLookup, setMarksLookup] = useState<Mapping<string, number>>({})
  useEffect(() => {
    if (!userDetails) return
    axiosInstance
      .request({
        method: 'GET',
        url: endpoints.marks(year!, moduleCode!, parseInt(exerciseNumber!)),
      })
      .then(({ data }: { data: any }) => {
        let deserialised = data.map((d: any) => plainToInstance(Mark, d))
        setMarksLookup(
          deserialised.reduce((grouped: Mapping<string, Mark>, mark: Mark) => {
            return { ...grouped, [mark.student_username]: mark.mark }
          }, {})
        )
      })
      .catch(() => addToast({ variant: 'error', title: 'Unable to get marks' }))
  }, [addToast, axiosInstance, exerciseNumber, moduleCode, userDetails, year])

  return {
    enrolledStudents,
    studentSubmissionsLookup,
    studentGroupsLookup,
    studentLookup,
    marksLookup,
  }
}
