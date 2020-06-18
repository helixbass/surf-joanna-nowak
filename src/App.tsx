import React, {FC} from 'react'
import {
  flowMax,
  addDisplayName,
  addProps,
  addState,
  addHandlers,
  addStateHandlers,
} from 'ad-hok'
import {set as setMutate, delay} from 'lodash'
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

const getAngleDifference = (firstAngle: Angle, secondAngle: Angle) => {
  const difference = Math.abs(firstAngle - secondAngle)
  return difference > PI ? 2 * PI - difference : difference
}

const getRandomAngle = ({startPosition}: {startPosition: Angle}): Angle => {
  while (true) {
    const angle = random(2 * PI, true)
    if (getAngleDifference(angle, startPosition) > PI * 0.5) return angle
  }
}

type Ref = HTMLElement | SVGElement | null
type Refs = {
  [name: string]: Ref
}

type Color = string

interface BlueStripeProps {
  startPosition: Angle
  endPosition: Angle
  generateNewStripe: (opts: {startPosition: Angle; color: Color}) => void
  color: Color
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
  addLayoutEffectOnMount(
    ({refs, endPosition, generateNewStripe, color}) => () => {
      const {blueStripe, whiteStripe} = refs
      gsap
        .timeline()
        .from([blueStripe, whiteStripe], {
          duration: 0.3,
          drawSVG: '0%',
          ease: 'linear',
        })
        .call(() => {
          delay(
            () =>
              generateNewStripe({
                startPosition: endPosition,
                color:
                  color === colors.blueRoad
                    ? colors.greenOffRoad
                    : colors.blueRoad,
              }),
            random(2000, true),
          )
        })
        .to([blueStripe, whiteStripe], {opacity: 0, duration: 1.1, delay: 1})
    },
  ),
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
    color,
  }) => (
    <>
      <path
        ref={setRef('blueStripe')}
        d={`M ${startX} ${startY} L ${endX} ${endY}`}
        stroke={color}
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
    },
  ),
  addState('refs', 'setRefs', {} as Refs),
  addHandlers({
    setRef: ({refs}) => (name: string) => (ref: Ref) => {
      setMutate(refs, name, ref)
    },
  }),
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
    })
  }),
  ({blueStripes, generateNewStripe, setRef}) => (
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
          {blueStripes.map(({startPosition, endPosition, color}) => (
            <BlueStripe
              startPosition={startPosition}
              endPosition={endPosition}
              generateNewStripe={generateNewStripe}
              color={color}
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
