import { plainToInstance } from 'class-transformer'
import { Fragment, useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'

import ExerciseDialog from '../components/dialogs/ExerciseDialog'
import { endpoints } from '../constants/endpoints'
import { Exercise } from '../constants/types'
import { useAxios } from '../lib/axios.context'
import { calculateGrade, displayTimestamp, percentage } from '../lib/utilities.service'
import { useYear } from '../lib/year.context'
import { Link, LinkIcon } from '../styles/exerciseDialog.style'
import {
  Header,
  HorizontalRow,
  SubText,
  Table,
  ViewExerciseButton,
} from '../styles/exercises-page.style'

const Exercises = () => {
  const { year } = useYear()
  const { moduleCode } = useOutletContext<{ moduleCode: string | null }>()!
  const [exercises, setExercises] = useState<Exercise[]>([])
  const { data: rawExercises } = useAxios({
    url: endpoints.exercises(year),
    method: 'GET',
    params: { module_code: moduleCode },
  })
  useEffect(() => {
    if (rawExercises !== null) {
      setExercises(
        rawExercises
          .map((exercise: any) => plainToInstance(Exercise, exercise))
          .sort((ex1: Exercise, ex2: Exercise) => Number(ex1.endDate) - Number(ex2.endDate))
      )
    }
  }, [rawExercises])

  const [exerciseForDialog, setExerciseForDialog] = useState<Exercise | null>(null)

  if (!exercises?.length)
    return <p style={{ marginTop: '5rem' }}>No exercises available for this module yet.</p>

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
                    <SubText>{displayTimestamp(e.endDate)}</SubText>
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
