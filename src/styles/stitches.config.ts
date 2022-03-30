import { createStitches, createTheme } from '@stitches/react'

export const { styled, css, globalCss, theme } = createStitches({
  theme: {
    colors: {
      backgroundColor: 'white',
      color: 'black',
    },
  },
})

export const darkTheme = createTheme({
  colors: {
    backgroundColor: 'black',
    color: 'white',
  },
})

export const globalStyles = globalCss({
  '@import': ["url('https://rsms.me/inter/inter.css')"],
  'html, body': {
    margin: 0,
    padding: 0,
    fontFamily: `Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
                 Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
                 sans-serif`,
    backgroundColor: '$backgroundColor',
    color: '$color',
    transition: 'background-color 1s ease-in-out',
    fontWeight: 600,
  },
  '@supports (font-variation-settings: normal)': {
    sansFont: 'Inter var',
  },
  '*': {
    boxSizing: 'border-box',
  },
  a: {
    color: 'inherit',
    textDecoration: 'none',
  },
})
