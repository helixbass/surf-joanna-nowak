import React, {FC} from 'react'
import {flowMax, addDisplayName} from 'ad-hok'

import {makeStyles, colors} from 'utils/style'

const CIRCLE_WIDTH = 400
const INNER_CIRClE_CLIP_PATH_ID = 'inner-circle-clip-path'
const INNER_CIRCLE_PADDING_PER_SIDE = CIRCLE_WIDTH * 0.068
const INNER_CIRCLE_WIDTH = CIRCLE_WIDTH - 2 * INNER_CIRCLE_PADDING_PER_SIDE

const App: FC = flowMax(addDisplayName('App'), () => (
  <div css={styles.container}>
    <svg
      height={CIRCLE_WIDTH}
      width={CIRCLE_WIDTH}
      viewBox={`0 0 ${CIRCLE_WIDTH} ${CIRCLE_WIDTH}`}
    >
      <defs>
        <clipPath id={INNER_CIRClE_CLIP_PATH_ID}>
          <circle
            cx={CIRCLE_WIDTH / 2}
            cy={CIRCLE_WIDTH / 2}
            r={INNER_CIRCLE_WIDTH / 2}
          />
        </clipPath>
      </defs>
      <circle
        cx={CIRCLE_WIDTH / 2}
        cy={CIRCLE_WIDTH / 2}
        r={CIRCLE_WIDTH / 2}
        fill={colors.white}
      />
      <g clipPath={`url(#${INNER_CIRClE_CLIP_PATH_ID})`}>
        <path
          d={`M ${CIRCLE_WIDTH} 0 L 0 ${CIRCLE_WIDTH * 0.3}`}
          stroke={colors.blueRoad}
          strokeWidth={CIRCLE_WIDTH * 0.14}
        />
      </g>
    </svg>
  </div>
))

export default App

const styles = makeStyles({
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.blueBackground,
    minHeight: '100vh',
  },
})
