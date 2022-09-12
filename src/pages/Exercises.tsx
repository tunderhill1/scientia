import { plainToInstance } from 'class-transformer'
import { Fragment, useEffect, useState } from 'react'
import { ChatLeftText } from 'react-bootstrap-icons'
import { useOutletContext } from 'react-router-dom'

import ExerciseDialog from '../components/dialogs/ExerciseDialog'
import { endpoints } from '../constants/endpoints'
import { Exercise } from '../constants/types'
import { useAxios } from '../lib/axios.context'
import { displayTimestamp, percentageToLetterGrade } from '../lib/utilities.service'
import { useYear } from '../lib/year.context'
import {
  FeedbackLink,
  Header,
  HorizontalRow,
  Pill,
  SubText,
  Table,
  ViewExerciseButton,
  ViewExerciseIcon,
} from '../styles/exercises-page.style'

const Exercises = () => {
  const { year } = useYear()
  const moduleCode = useOutletContext<string | null>()!
  const [exercises, setExercises] = useState<Exercise[]>([])
  const { data: rawExercises } = useAxios({
    url: endpoints.exercises(`${year}`),
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

  if (!exercises)
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}
      >
        <p>No exercises available for this module yet.</p>
      </div>
    )

  return (
    <>
      <Table>
        <thead style={{ textAlign: 'left' }}>
          <tr>
            <Header colSpan={2}>Exercise</Header>
            <Header>View</Header>
            <Header colSpan={2}>Mark</Header>
            <Header>Feedback</Header>
          </tr>
        </thead>
        <tbody>
          {exercises.map((e: Exercise) => {
            let percentageGrade = Math.round((100 * (e.mark || 0)) / e.maximumMark!)
            return (
              <Fragment key={e.number}>
                <HorizontalRow colSpan={6} />
                <tr>
                  <td style={{ whiteSpace: 'nowrap' }}>
                    <b>{e.number}.</b> {e.title}
                    <br />
                    <SubText>Due: {displayTimestamp(e.endDate, 'EEEE d LLLL, HH:mm zzz')}</SubText>
                  </td>

                  <td>
                    <Pill>{e.type}</Pill>
                  </td>

                  <td>
                    <ViewExerciseButton onClick={() => setExerciseForDialog(e)}>
                      <ViewExerciseIcon size={20} />
                    </ViewExerciseButton>
                  </td>

                  <td>{e.mark ? <b>{percentageToLetterGrade(percentageGrade)}</b> : <p>N/A</p>}</td>

                  <td style={{ whiteSpace: 'nowrap' }}>
                    {e.mark && (
                      <>
                        {`${percentageGrade}%`}
                        <br />
                        <SubText>{`${e.mark} / ${e.maximumMark}`}</SubText>
                      </>
                    )}
                  </td>

                  <td>
                    <FeedbackLink
                      href="https://example.com/"
                      target="_blank"
                      rel="noreferrer"
                      title={e.mark ? `Feedback for ${e.title}` : 'Not yet published'}
                      disabled={!e.mark}
                    >
                      <ChatLeftText size={20} />
                    </FeedbackLink>
                  </td>
                </tr>
              </Fragment>
            )
          })}
        </tbody>
      </Table>
      {exerciseForDialog && (
        <ExerciseDialog
          exercise={exerciseForDialog}
          setExercise={() => setExerciseForDialog(null)}
        />
      )}
    </>
  )
}

export default Exercises
