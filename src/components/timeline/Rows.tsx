import { css } from '../../styles/stitches.config'
import { Grid } from '../../styles/timeline/rows.style'

export const Rows = ({ weeks }: { weeks: number }) => {
  return (
    <Grid css={{ gridTemplateColumns: `repeat(${weeks}, 15rem)` }}>
      {[...Array(11)].map((_, id) => (
        <div
          key={id}
          className={css({ height: `100%`, backgroundColor: '$subtleBackground', borderRadius: '0.5rem' })()}
        />
      ))}
    </Grid>
  )
}
