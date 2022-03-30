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
  'html, body': {
    margin: 0,
    padding: 0,
    fontFamily: `-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
                 Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
                 sans-serif`,
    backgroundColor: '$backgroundColor',
    color: '$color',
    transition: 'background-color 1s ease-in-out',
  },
  '*': {
    boxSizing: 'border-box',
  },
  a: {
    color: 'inherit',
    textDecoration: 'none',
  },
})
