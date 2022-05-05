import { createStitches, createTheme } from '@stitches/react'
import { sand, sandDark } from '@radix-ui/colors'

export const { styled, css, globalCss, theme } = createStitches({
  theme: {
    colors: {
      ...sand,
      appBackground: '$sand1',
      subtleBackground: '$sand2',
      elementBackground: '$sand3',
      elementHover: '$sand4',
      elementActive: '$sand5',
      separator: '$sand6',
      elementBorder: '$sand7',
      elementHoverBorder: '$sand8',
      solidBackground: '$sand9',
      solidHover: '$sand10',
      lowContrast: '$sand11',
      highContrast: '$sand12',
    },
  },
})

export const darkTheme = createTheme({
  colors: {
    ...sandDark,
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
    backgroundColor: '$appBackground',
    color: '$highContrast',
    transition: 'background-color 1s ease-in-out',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
  },
  '@supports (font-variation-settings: normal)': {
    sansFont: 'Inter var',
  },
  '*, *::before, *::after': {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
  },
  '*::selection, *::-moz-selection': {
    color: '$appBackground',
    backgroundColor: '$highContrast',
  },
  a: {
    color: 'inherit',
    textDecoration: 'none',
  },
})
