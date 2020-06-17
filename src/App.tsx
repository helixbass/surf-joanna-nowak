import React, {FC} from 'react'
import {flowMax, addDisplayName, addProps} from 'ad-hok'

import {makeStyles, colors} from 'utils/style'

const CIRCLE_WIDTH = 400
const CIRCLE_RADIUS = CIRCLE_WIDTH * 0.5
const INNER_CIRClE_CLIP_PATH_ID = 'inner-circle-clip-path'
const INNER_CIRCLE_PADDING_PER_SIDE = CIRCLE_WIDTH * 0.068
const INNER_CIRCLE_WIDTH = CIRCLE_WIDTH - 2 * INNER_CIRCLE_PADDING_PER_SIDE
// const INNER_CIRCLE_RADIUS = INNER_CIRCLE_WIDTH * 0.5
const {PI} = Math

interface BlueStripeProps {
  startPosition: number
  endPosition: number
}

const BlueStripe: FC<BlueStripeProps> = flowMax(
  addDisplayName('BlueStripe'),
  addProps(
    flowMax(
      ({startPosition, endPosition}) => ({
        startX: Math.sin(startPosition),
        startY: Math.cos(startPosition) * -1,
        endX: Math.sin(endPosition),
        endY: Math.cos(endPosition) * -1,
      }),
      ({startX, startY, endX, endY}) => ({
        startX: CIRCLE_RADIUS + startX * CIRCLE_RADIUS,
        startY: CIRCLE_RADIUS + startY * CIRCLE_RADIUS,
        endX: CIRCLE_RADIUS + endX * CIRCLE_RADIUS,
        endY: CIRCLE_RADIUS + endY * CIRCLE_RADIUS,
      }),
    ),
  ),
  ({startX, startY, endX, endY}) => (
    <path
      d={`M ${startX} ${startY} L ${endX} ${endY}`}
      stroke={colors.blueRoad}
      strokeWidth={CIRCLE_WIDTH * 0.14}
    />
  ),
)

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
        <BlueStripe startPosition={PI * 0.17} endPosition={PI * 1.7} />
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
