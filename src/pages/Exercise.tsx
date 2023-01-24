import React from 'react'
import { Helmet } from 'react-helmet-async'
import { useParams } from 'react-router-dom'

import PagePlaceholder from '../components/PagePlaceholder'
import ExerciseMaterialsSection from '../components/exercise/ExerciseMaterialsSection'
import titles from '../constants/titles'
import { useExerciseForStudent, useExerciseMaterials } from '../lib/exercise.service'
import { useUser } from '../lib/user.context'
import { Container, Hr } from '../styles/_app.style'
import { Link } from '../styles/exercise.style'
import { css } from '../styles/stitches.config'
import ExerciseStaff from './ExerciseStaff'
import ExerciseStudent from './ExerciseStudent'

const Exercise = () => {
  const { year, moduleCode, exerciseNumber } = useParams()
  const { userDetails } = useUser()
  const { exercise, exerciseIsLoaded } = useExerciseForStudent()
  const { spec, dataFiles, modelAnswers, fileRequirements } = useExerciseMaterials()
  const pageTitle = titles.exercise(year, exercise, moduleCode, exerciseNumber)

  if (!exercise || (!spec && !fileRequirements?.length && !exercise.isGroupFormation)) {
    return (
      <PagePlaceholder
        title={pageTitle}
        header={`${moduleCode}: ${exerciseNumber}`}
        loading={!exerciseIsLoaded}
        loadingText={'Loading exercise...'}
        noInfoText={'No information for this exercise.'}
      />
    )
  }

  const moduleTitle = userDetails?.modules.find((m) => m.code === exercise.moduleCode)?.title
  return (
    <Container>
      <Helmet>
        <title>{pageTitle}</title>
      </Helmet>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-around',
          flexWrap: 'wrap',
          gap: '2rem',
        }}
      >
        <section>
          <h1>
            {exercise.type} {exerciseNumber}: {exercise.title}
          </h1>
          <Link href={`/${year}/modules/${moduleCode}/materials`} css={{ textDecoration: 'none' }}>
            <h3
              className={css({
                color: '$lowContrast',
                fontWeight: '400',
              })()}
            >
              {moduleCode} {moduleTitle}
            </h3>
          </Link>
        </section>
        {spec && (
          <ExerciseMaterialsSection spec={spec} dataFiles={dataFiles} modelAnswers={modelAnswers} />
        )}
        <Hr />
        {userDetails &&
          (userDetails.isStaff || userDetails.isTaForModule(moduleCode!) ? (
            <ExerciseStaff />
          ) : (
            <ExerciseStudent />
          ))}
      </div>
    </Container>
  )
}

export default Exercise
