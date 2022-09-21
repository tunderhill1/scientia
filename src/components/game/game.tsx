import { Star } from 'react-bootstrap-icons'

const STAR_FONT_SCALING = 0.34

const starLevelStyle = {
  gridRowStart: 1,
  gridColumnStart: 1,
  alignSelf: 'center',
  justifySelf: 'center',
  paddingTop: '0.25rem',
}

export const LevelStar = ({ size, level }: { size: number; level: number }) => (
  <div style={{ userSelect: 'none', display: 'grid' }}>
    <Star style={{ gridRowStart: 1, gridColumnStart: 1 }} color="gold" size={size} />
    <span style={{ fontSize: size * STAR_FONT_SCALING, ...starLevelStyle }}>{level}</span>
  </div>
)
