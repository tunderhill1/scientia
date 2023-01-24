import React from 'react'
import { Helmet } from 'react-helmet-async'

import { Banner, Container } from '../styles/_app.style'

const DEFAULT_LOADING_TEXT = 'Loading...'
const DEFAULT_NO_INFO_TEXT = 'No information available on this resource.'

const PagePlaceholder = ({
  title,
  header,
  loading,
  loadingText = DEFAULT_LOADING_TEXT,
  noInfoText = DEFAULT_NO_INFO_TEXT,
}: {
  title: string
  header: string
  loading: boolean
  loadingText?: string
  noInfoText?: string
}) => {
  return (
    <Container>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <section style={{ marginBottom: '2rem' }}>
        <h1>{header}</h1>
      </section>
      <Banner center>
        <span>{!loading ? loadingText : noInfoText}</span>
      </Banner>
    </Container>
  )
}

export default PagePlaceholder
