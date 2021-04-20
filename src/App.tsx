import React, {FC} from 'react'
import {flowMax, addDisplayName, addStateHandlers, addWrapper} from 'ad-hok'
import gsap from 'gsap'
import 'typeface-lobster'

import {makeStyles} from 'utils/style'
import {DrawSVGPlugin} from 'utils/gsap/DrawSVGPlugin'
import {colors} from 'utils/colors'
import Intro from 'components/Intro'
import Panorama from 'components/Panorama'
import {
  CIRCLE_WIDTH_PX,
  CIRCLE_WIDTH,
  INNER_CIRClE_CLIP_PATH_ID,
  INNER_CIRCLE_WIDTH,
} from 'utils/sizes'
import {NonSvgPortalHost} from 'components/portals'

gsap.registerPlugin(DrawSVGPlugin)

const App: FC = flowMax(
  addDisplayName('App'),
  addWrapper((render) => (
    <div css={styles.container}>
      <svg
        height={CIRCLE_WIDTH_PX}
        width={CIRCLE_WIDTH_PX}
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
        {render()}
      </svg>
      <NonSvgPortalHost />
    </div>
  )),
  addStateHandlers(
    {
      isShowingIntro: true,
    },
    {
      onLetsGoPress: () => () => ({
        isShowingIntro: false,
      }),
    },
  ),
  ({isShowingIntro, onLetsGoPress}) => (
    <>
      <Intro isShowing={isShowingIntro} onLetsGoPress={onLetsGoPress} />
      <Panorama isShowing={!isShowingIntro} />
    </>
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
