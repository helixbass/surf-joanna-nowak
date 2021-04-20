import React, {FC} from 'react'
import {
  flowMax,
  addDisplayName,
  addStateHandlers,
  addWrapper,
  branch,
  renderNothing,
} from 'ad-hok'
import {without} from 'lodash'
import {addLayoutEffectOnMount} from 'ad-hok-utils'
import gsap from 'gsap'

import {PI, Angle, getRandomAngle} from 'utils/angles'
import {colors, Color} from 'utils/colors'
import {addRefs} from 'utils/refs'
import {INNER_CIRClE_CLIP_PATH_ID, CIRCLE_RADIUS} from 'utils/sizes'
import BlueStripe from 'components/BlueStripe'
import Loading from 'components/Loading'
import LetsGoButton from 'components/LetsGoButton'
import {NonSvgPortal} from 'components/portals'

interface BlueStripeSpec {
  startPosition: Angle
  endPosition: Angle
  color: Color
}

interface Props {
  isShowing: boolean
  onLetsGoPress: () => void
}

const Intro: FC<Props> = flowMax(
  addDisplayName('Intro'),
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
  addStateHandlers(
    {
      isLoading: true,
    },
    {
      onFinishedLoading: () => () => ({
        isLoading: false,
      }),
    },
  ),
  addWrapper(
    (
      render,
      {
        blueStripes,
        generateNewStripe,
        removeBlueStripe,
        setRef,
        onFinishedLoading,
      },
    ) => (
      <>
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
        <NonSvgPortal>
          <Loading onFinished={onFinishedLoading} />
          {render()}
        </NonSvgPortal>
      </>
    ),
  ),
  branch(({isLoading}) => isLoading, renderNothing()),
  ({onLetsGoPress}) => <LetsGoButton onClick={onLetsGoPress} />,
)

export default Intro
