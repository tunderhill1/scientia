import React from 'react'

import { Material } from '../../constants/types'
import { Link, LinkIcon, ResourcesWrapper } from '../../styles/exercise.style'

const ExerciseMaterialsSection = ({
  spec,
  dataFiles,
  modelAnswers,
}: {
  spec: Material
  dataFiles: Material[]
  modelAnswers: Material[]
}) => {
  return (
    <ResourcesWrapper>
      {spec && (
        <Link target="_blank" href={spec.url}>
          <LinkIcon />
          Specification
        </Link>
      )}
      {!!dataFiles?.length && (
        <Link target="_blank" href={dataFiles[0].url}>
          <LinkIcon />
          Data Files
        </Link>
      )}
      {!!modelAnswers?.length && (
        <Link target="_blank" href={modelAnswers[0].url}>
          <LinkIcon />
          Model Answers
        </Link>
      )}
    </ResourcesWrapper>
  )
}

export default ExerciseMaterialsSection
