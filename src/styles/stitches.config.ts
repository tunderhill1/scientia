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
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
  },
  '@supports (font-variation-settings: normal)': {
    sansFont: 'Inter var',
  },
  '*': {
    boxSizing: 'border-box',
  },
  '*::selection, *::-moz-selection': {
    color: '$backgroundColor',
    backgroundColor: '$color',
  },
  a: {
    color: 'inherit',
    textDecoration: 'none',
  },
})
