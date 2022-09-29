import { plainToInstance } from 'class-transformer'
import { Fragment, useContext, useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'

import ExerciseDialog from '../components/dialogs/ExerciseDialog'
import { endpoints } from '../constants/endpoints'
import { Exercise } from '../constants/types'
import { AxiosContext } from '../lib/axios.context'
import { useToast } from '../lib/toast.context'
import { useUser } from '../lib/user.context'
import { calculateGrade, displayTimestamp, percentage } from '../lib/utilities.service'
import { Wrapper } from '../styles/_app.style'
import { Link, LinkIcon } from '../styles/exerciseDialog.style'
import {
  Header,
  HorizontalRow,
  SubText,
  Table,
  ViewExerciseButton,
} from '../styles/exercises-page.style'

const Exercises = () => {
  const axiosInstance = useContext(AxiosContext)
  const { requestedYear: year } = useParams()
  const { addToast } = useToast()
  const { moduleCode } = useOutletContext<{ moduleCode: string | null }>()!
  const { userDetails } = useUser()

  const [exercises, setExercises] = useState<Exercise[]>([])

  useEffect(() => {
    axiosInstance
      .request({
        url: endpoints.exercises(year!),
        method: 'GET',
        params: { module_code: moduleCode },
      })
      .then(({ data }: { data: any }) => {
        if (data === null) setExercises([])
        setExercises(
          data
            .map((exercise: any) => plainToInstance(Exercise, exercise))
            .sort((ex1: Exercise, ex2: Exercise) => ex1.deadline.getTime() - ex2.deadline.getTime())
        )
      })
      .catch((error) => {
        addToast({ variant: 'error', title: 'Error fetching exercises' })
        console.error(error)
      })
  }, [year])

  const [exerciseForDialog, setExerciseForDialog] = useState<Exercise | null>(null)

  if (!exercises?.length || userDetails?.isStaff)
    return (
      <Wrapper center>
        {userDetails?.isStaff
          ? '🚧 Staff area under construction.'
          : 'No exercises available for this module.'}
      </Wrapper>
    )

  return (
    <>
      <Table>
        <thead style={{ textAlign: 'left' }}>
          <tr>
            <Header>Exercise</Header>
            <Header colSpan={3}>Mark</Header>
          </tr>
        </thead>
        <tbody>
          {exercises.map((e: Exercise) => (
            <Fragment key={e.number}>
              <HorizontalRow colSpan={4} />
              <tr>
                <td>
                  <ViewExerciseButton
                    onClick={() => setExerciseForDialog(e)}
                    title="View exercise details"
                  >
                    <p>
                      {e.type}: {e.title}
                    </p>
                    <SubText>{displayTimestamp(e.deadline)}</SubText>
                  </ViewExerciseButton>
                </td>

                <td>{e.mark ? <b>{calculateGrade(e.mark, e.maximumMark)}</b> : <p>n/a</p>}</td>

                <td style={{ whiteSpace: 'nowrap' }}>
                  {e.mark && (
                    <>
                      {percentage(e.mark, e.maximumMark)}
                      <br />
                      <SubText>
                        {e.mark} / {e.maximumMark}
                      </SubText>
                    </>
                  )}
                </td>

                {e.mark && (
                  <td>
                    <Link
                      css={{ fontSize: '$md' }}
                      target="_blank"
                      href={e.mark ? 'https://example.com/' : '#'}
                      title={e.mark ? `Feedback for ${e.title}` : 'Not yet published'}
                    >
                      <LinkIcon />
                      Feedback
                    </Link>
                  </td>
                )}
              </tr>
            </Fragment>
          ))}
        </tbody>
      </Table>
      {exerciseForDialog && (
        <ExerciseDialog exercise={exerciseForDialog} setExercise={setExerciseForDialog} />
      )}
    </>
  )
}

export default Exercises
