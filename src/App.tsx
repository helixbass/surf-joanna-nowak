import React, {FC} from 'react'
import {
  flowMax,
  addDisplayName,
  addProps,
  addState,
  addHandlers,
  addStateHandlers,
} from 'ad-hok'
import {set as setMutate} from 'lodash'
import gsap from 'gsap'
import {random} from 'lodash/fp'

import {makeStyles, colors} from 'utils/style'
import {DrawSVGPlugin} from 'utils/gsap/DrawSVGPlugin'
import {addLayoutEffectOnMount} from 'utils/addEffectOnMount'

gsap.registerPlugin(DrawSVGPlugin)

const CIRCLE_WIDTH = 400
const CIRCLE_RADIUS = CIRCLE_WIDTH * 0.5
const INNER_CIRClE_CLIP_PATH_ID = 'inner-circle-clip-path'
const INNER_CIRCLE_PADDING_PER_SIDE = CIRCLE_WIDTH * 0.068
const INNER_CIRCLE_WIDTH = CIRCLE_WIDTH - 2 * INNER_CIRCLE_PADDING_PER_SIDE
// const INNER_CIRCLE_RADIUS = INNER_CIRCLE_WIDTH * 0.5
const {PI} = Math

type Angle = number

const getAngleFromVertical = (radians: Angle) =>
  radians > PI ? PI * 2 - radians : radians

const getRandomAngle = (): Angle => random(2 * PI, true)

type Ref = HTMLElement | SVGElement | null
type Refs = {
  [name: string]: Ref
}

interface BlueStripeProps {
  startPosition: Angle
  endPosition: Angle
  generateNewStripe: ({startPosition}: {startPosition: Angle}) => void
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
    ['startPosition', 'endPosition'],
  ),
  addProps(
    ({startPosition, endPosition}) => ({
      angleFromHorizontal:
        getAngleFromVertical(startPosition) - getAngleFromVertical(endPosition),
    }),
    ['startPosition', 'endPosition'],
  ),
  addProps({
    strokeWidthBlue: CIRCLE_WIDTH * 0.14,
    strokeWidthWhite: CIRCLE_WIDTH * 0.014,
  }),
  addProps(
    ({strokeWidthBlue, strokeWidthWhite}) => ({
      spaceBetweenBlueEdgeAndWhiteEdgeWhenCentered:
        (strokeWidthBlue - strokeWidthWhite) * 0.5,
    }),
    ['strokeWidthBlue', 'strokeWidthWhite'],
  ),
  addProps(
    ({spaceBetweenBlueEdgeAndWhiteEdgeWhenCentered}) => ({
      whiteStripeTranslateUnangled:
        spaceBetweenBlueEdgeAndWhiteEdgeWhenCentered * 0.78,
    }),
    ['spaceBetweenBlueEdgeAndWhiteEdgeWhenCentered'],
  ),
  addProps(
    ({angleFromHorizontal, whiteStripeTranslateUnangled}) => ({
      whiteStripeTranslateX:
        whiteStripeTranslateUnangled * Math.sin(angleFromHorizontal),
      whiteStripeTranslateY:
        whiteStripeTranslateUnangled * Math.cos(angleFromHorizontal),
    }),
    ['angleFromHorizontal', 'whiteStripeTranslateUnangled'],
  ),
  addState('refs', 'setRefs', {} as Refs),
  addHandlers({
    setRef: ({refs}) => (name: string) => (ref: Ref) => {
      setMutate(refs, name, ref)
    },
  }),
  addLayoutEffectOnMount(({refs, endPosition, generateNewStripe}) => () => {
    gsap
      .from([refs.blueStripe, refs.whiteStripe], {
        duration: 1,
        drawSVG: '0%',
        ease: 'linear',
      })
      .eventCallback('onComplete', () => {
        generateNewStripe({startPosition: endPosition})
      })
  }),
  ({
    startX,
    startY,
    endX,
    endY,
    whiteStripeTranslateX,
    whiteStripeTranslateY,
    strokeWidthBlue,
    strokeWidthWhite,
    setRef,
  }) => (
    <>
      <path
        ref={setRef('blueStripe')}
        d={`M ${startX} ${startY} L ${endX} ${endY}`}
        stroke={colors.blueRoad}
        strokeWidth={strokeWidthBlue}
      />
      <path
        ref={setRef('whiteStripe')}
        d={`M ${startX} ${startY} L ${endX} ${endY}`}
        stroke={colors.white}
        strokeWidth={strokeWidthWhite}
        transform={`translate(${whiteStripeTranslateX} ${whiteStripeTranslateY})`}
      />
    </>
  ),
)

interface BlueStripeSpec {
  startPosition: Angle
  endPosition: Angle
}

const App: FC = flowMax(
  addDisplayName('App'),
  addStateHandlers(
    {
      blueStripes: [
        {
          startPosition: PI * 1.67,
          endPosition: PI * 0.21,
        },
      ] as BlueStripeSpec[],
    },
    {
      generateNewStripe: ({blueStripes}) => ({
        startPosition,
      }: {
        startPosition: Angle
      }) => ({
        blueStripes: [
          ...blueStripes,
          {
            startPosition,
            endPosition: getRandomAngle(),
          },
        ],
      }),
    },
  ),
  ({blueStripes, generateNewStripe}) => (
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
          {blueStripes.map(({startPosition, endPosition}) => (
            <BlueStripe
              startPosition={startPosition}
              endPosition={endPosition}
              generateNewStripe={generateNewStripe}
              key={`${startPosition}-${endPosition}`}
            />
          ))}
        </g>
      </svg>
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
