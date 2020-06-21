import React, {FC} from 'react'
import {flowMax, addDisplayName, addProps} from 'ad-hok'
import {delay} from 'lodash'
import {random} from 'lodash/fp'
import gsap from 'gsap'
import {addLayoutEffectOnMount} from 'ad-hok-utils'

import {Angle, getAngleFromVertical} from 'utils/angles'
import {Color, colors} from 'utils/colors'
import {CIRCLE_RADIUS, CIRCLE_WIDTH} from 'utils/sizes'
import {addRefs} from 'utils/refs'

interface BlueStripeProps {
  startPosition: Angle
  endPosition: Angle
  generateNewStripe: (opts: {startPosition: Angle; color: Color}) => void
  color: Color
  removeSelf: () => void
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
  addRefs,
  addLayoutEffectOnMount(
    ({refs, endPosition, generateNewStripe, color, removeSelf}) => () => {
      const {blueStripe, whiteStripe} = refs
      gsap
        .timeline()
        .from([blueStripe, whiteStripe], {
          duration: 0.3,
          drawSVG: '0%',
          ease: 'linear',
        })
        .call(() => {
          delay(() => {
            generateNewStripe({
              startPosition: endPosition,
              color:
                color === colors.blueRoad
                  ? colors.greenOffRoad
                  : colors.blueRoad,
            })
          }, random(2000, true))
        })
        .to([blueStripe, whiteStripe], {
          opacity: 0,
          duration: 1.1,
          delay: 1,
        })
        .call(removeSelf)
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

export default BlueStripe
