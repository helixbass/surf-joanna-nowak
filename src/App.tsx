import React, {FC} from 'react'
import {flowMax, addDisplayName, addHandlers, addStateHandlers} from 'ad-hok'
import {without} from 'lodash'
import gsap from 'gsap'
import 'typeface-lobster'
import {addLayoutEffectOnMount} from 'ad-hok-utils'

import {makeStyles} from 'utils/style'
import {DrawSVGPlugin} from 'utils/gsap/DrawSVGPlugin'
import BlueStripe from 'components/BlueStripe'
import {Angle, getRandomAngle, PI} from 'utils/angles'
import {Color, colors} from 'utils/colors'
import {
  CIRCLE_WIDTH,
  INNER_CIRClE_CLIP_PATH_ID,
  INNER_CIRCLE_WIDTH,
  CIRCLE_RADIUS,
} from 'utils/sizes'
import {addRefs} from 'utils/refs'
import Loading from 'components/Loading'

gsap.registerPlugin(DrawSVGPlugin)

interface BlueStripeSpec {
  startPosition: Angle
  endPosition: Angle
  color: Color
}

const App: FC = flowMax(
  addDisplayName('App'),
  addStateHandlers(
    {
      blueStripes: [
        {
          startPosition: PI * 1.67,
          endPosition: PI * 0.21,
          color: colors.blueRoad,
        },
      ] as BlueStripeSpec[],
    },
    {
      generateNewStripe: ({blueStripes}) => ({
        startPosition,
        color,
      }: {
        startPosition: Angle
        color: Color
      }) => ({
        blueStripes: [
          ...blueStripes,
          {
            startPosition,
            endPosition: getRandomAngle({startPosition}),
            color,
          },
        ],
      }),
      removeBlueStripe: ({blueStripes}) => (blueStripe: BlueStripeSpec) => ({
        blueStripes: without(blueStripes, blueStripe),
      }),
    },
  ),
  addRefs,
  addLayoutEffectOnMount(({refs}) => () => {
    const {circleContents} = refs
    // gsap.set(circleContents, {
    //   // transformOrigin: '50% 50%',
    //   transformOrigin: `${CIRCLE_RADIUS} ${CIRCLE_RADIUS}`,
    // })
    gsap.to(circleContents, {
      duration: 340,
      rotate: 360,
      repeat: -1,
      ease: 'linear',
    })
  }),
  addHandlers({
    onFinishedLoading: () => () => {},
  }),
  ({
    blueStripes,
    generateNewStripe,
    removeBlueStripe,
    setRef,
    onFinishedLoading,
  }) => (
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
        <g
          clipPath={`url(#${INNER_CIRClE_CLIP_PATH_ID})`}
          data-svg-origin={`${CIRCLE_RADIUS} ${CIRCLE_RADIUS}`}
          ref={setRef('circleContents')}
        >
          {blueStripes.map((blueStripeSpec) => (
            <BlueStripe
              {...blueStripeSpec}
              generateNewStripe={generateNewStripe}
              removeSelf={() => {
                removeBlueStripe(blueStripeSpec)
              }}
              key={`${blueStripeSpec.startPosition}-${blueStripeSpec.endPosition}`}
            />
          ))}
        </g>
      </svg>
      <Loading onFinished={onFinishedLoading} />
    </div>
  ),
)

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
