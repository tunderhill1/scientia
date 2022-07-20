import { css } from '../../styles/stitches.config'
import { Grid } from '../../styles/timeline/rows.style'

// export const MainBackground = ({ cols, rowHeights }: { cols: number, rowHeights:  {[code: string]: string} }) => {
//   return (
//       <Grid css={{ gridTemplateColumns: `repeat(${cols}, 15rem)`, paddingTop: '0.5rem',}}>
//         {[...Array(cols)].map((_, id) => (
//             <div
//                 key={id}
//                 className={css({ height: `100%`, backgroundColor: '$subtleBackground', borderRadius: '0.5rem' })()}
//             />
//         ))}
//       </Grid>
//   )
// }

export const MainBackground = ({ cols, rowHeights }: { cols: number; rowHeights: { [code: string]: string } }) => {
  return (
    <Grid css={{ gridTemplateColumns: `repeat(${cols}, 15rem)` }}>
      {[...Array(cols)].map((_, id) => (
        <div key={id} style={{ height: `100%`, borderRadius: '0.5rem', paddingTop: '0.5rem' }}>
          {Object.values(rowHeights).map((height, index) => {
            /* NOTE: the computed height of each of the rows is:
             *    [given height (i.e. adjusted to accommodate all the required tracks)] +
             *    [2x padding of tabs (HARDCODED)]
             * This is so that the heights of rows and Modules tabs align.
             */
            return (
              <div
                key={index}
                className={css({
                  height: `calc(${height} + 0.75rem * 2)`,
                  backgroundColor: index % 2 === 0 ? '$subtleBackground' : '$appBackground',
                })()}
              />
            )
          })}
        </div>
      ))}
    </Grid>
  )
}
