import {
  amber,
  amberDark,
  blackA,
  blue,
  blueDark,
  cyan,
  cyanDark,
  green,
  greenDark,
  purple,
  red,
  redDark,
  sand,
  sandDark,
} from '@radix-ui/colors'
import { createStitches, createTheme } from '@stitches/react'

export const { styled, css, globalCss, theme } = createStitches({
  theme: {
    fontSizes: {
      fontSize: '16px' /* Root element's font size */,
      sm: '0.875rem', // 14px
      md: '1rem', // 16px (body size)
      lg: '1.125rem', // 18px
      xl: '1.5rem', // 24px
      xxl: '2rem', // 32px
    },
    lineHeights: {
      lineHeight: 'calc($fontSize * 1.5)',
    },
    shadows: {
      sm: '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06);',
      md: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06);',
      lg: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05);',
      xl: '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04);',
    },
    colors: {
      ...sand,
      ...blue,
      ...red,
      ...green,
      ...cyan,
      ...blackA,
      ...amber,
      ...purple,
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
      overlayBackground: '$blackA9',
      errorBackground: '$red9',
      successBackground: '$green9',
      infoBackground: '$cyan9',
    },
  },
})

export const darkTheme = createTheme({
  colors: {
    ...sandDark,
    ...blueDark,
    ...amberDark,
    ...redDark,
    ...greenDark,
    ...cyanDark,
  },
})

/* A good chunk of the style overrides were sourced (and modified) from the full Raster css file:
 * https://github.com/rsms/raster/blob/master/raster2.css
 */
export const globalStyles = globalCss({
  '@import': ["url('https://rsms.me/inter/inter.css')"],
  html: {
    fontSize: '$fontSize' /* NOTE: Investigate flowing size for responsiveness */,
    letterSpacing: '-.01em',
    '-webkit-text-size-adjust': '100%',
    '-moz-text-size-adjust': '100%',
    '-ms-text-size-adjust': '100%',
    'text-size-adjust': '100%',
    fontVariantLigatures: 'contextual common-ligatures',
    fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1, "cv10" 1',
  },
  body: {
    '-webkit-overflow-scrolling': 'touch',
    scrollBehavior: 'smooth',
    overflowX: 'hidden',
  },
  'html, body': {
    margin: 0,
    padding: 0,
    fontFamily: `Inter, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
                 Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
                 sans-serif`,
    backgroundColor: '$appBackground',
    '-webkit-font-smoothing': 'antialiased',
    '-moz-osx-font-smoothing': 'grayscale',
    '& *': {
      /* Fix for Chrome and Safari that don't otherwise transition text smoothly */
      color: '$highContrast',
      fontFamily: 'inherit',
      outlineColor: 'transparent',
    },
  },
  /* Animation override on theme toggle; see applyTheme function in src/lib/theme.context.tsx */
  '.animate *': {
    transition: 'all 1000ms ease-in-out 0s !important',
    '&:focus-visible': {
      outlineColor: 'transparent !important',
    },
  },
  ':focus-visible': {
    transition: 'background-color 250ms ease-in-out 0s',
  },
  ':first-child': {
    marginTop: 'unset',
  },
  ':last-child': {
    marginBottom: 'unset',
  },
  '@supports (font-variation-settings: normal)': {
    sansFont: 'Inter var, Inter V',
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
  'a, a:active, a:visited': {
    color: 'inherit',
    textDecoration: 'none',
  },
  '.bold, b, strong': {
    fontWeight: 600,
  },
  '.italic, em, i': {
    fontStyle: 'italic',
  },
  '.code, .monospace, code, pre, tt': {
    fontFamily: 'Inconsolata, Menlo, monospace',
    fontWeight: 430,
    wordWrap: 'break-word',
    whiteSpace: 'pre-wrap',
  },
  'b .code, b .monospace, b code, b pre, b tt': {
    fontWeight: 600,
  },
  '.code b, .monospace b, code b, pre b, tt b': {
    fontWeight: 580,
  },
  pre: {
    overflowX: 'auto',
    display: 'block',
  },
  'pre, pre code, pre tt': {
    whiteSpace: 'pre',
    wordWrap: 'normal',
  },
  /* Headings */
  h: {
    display: 'block',
    '-moz-appearance': 'none',
    appearance: 'none',
    '-webkit-appearance': 'none',
  },
  '.h1, h, h1': {
    fontWeight: 640,
    fontSize: '$xxl',
    lineHeight: 'calc($lineHeight * 2)',
    letterSpacing: '-.025rem',
    margin: '2rem 0 1rem 0',
    wordBreak: 'break-word',
  },
  '.h2, h2': {
    fontWeight: 600,
    fontSize: '$xl',
    lineHeight: 'calc($lineHeight * 1.5)',
    margin: '1.5rem 0 0.75rem 0',
  },
  '.h3, .h4, h3, h4': {
    fontWeight: 540,
    fontSize: '$xl',
    letterSpacing: '-.01rem',
    margin: '1rem 0 0.5rem 0',
  },
  '.h4, h4': {
    fontWeight: 580,
    letterSpacing: '-.02rem',
    fontSize: '$lg',
  },
  '.h5, .h6, h5, h6': {
    fontWeight: 500,
    fontSize: 'medium',
    margin: '0.75rem 0 0.25rem 0',
  },
  /* List */
  li: {
    marginLeft: '0.25rem',
    marginBottom: '0.5rem',
    '&>p+ol, &>p+ul': {
      marginTop: '-0.75rem',
    },
  },
  'ol, ul': {
    listStylePosition: 'outside',
  },
  ul: {
    paddingLeft: '1.5rem',
  },
  ol: {
    '&[start]': {
      '-webkit-padding-start': '1.5rem',
      paddingInlineStart: '1.5rem',
    },
    '&:not([start])': {
      listStyle: 'none',
      counterReset: 'ol-counter',
      paddingLeft: '1.5rem',
      '&>li': {
        counterIncrement: 'ol-counter',
        position: 'relative',
        '&:before': {
          content: 'counter(ol-counter) ". "',
          fontWeight: 500,
          fontVariantNumeric: 'tabular-nums',
          position: 'absolute',
          left: '-1.5rem',
          width: '1rem',
          textAlign: 'left',
        },
      },
    },
  },
  /* TODO: Table styling */
})
