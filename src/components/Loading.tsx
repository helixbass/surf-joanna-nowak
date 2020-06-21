import React, {FC} from 'react'
import {
  flowMax,
  addDisplayName,
  addStateHandlers,
  addEffect,
  addWrapper,
} from 'ad-hok'
import {delay, random} from 'lodash'
import {Transition} from 'react-transition-group'
import gsap from 'gsap'
import {addExtendedHandlers} from 'ad-hok-utils'

import {makeStyles} from 'utils/style'
import {colors, atOpacity} from 'utils/colors'
import addRenderingDelay from 'utils/addRenderingDelay'

interface Props {
  onFinished: () => void
}

const Loading: FC<Props> = flowMax(
  addDisplayName('Loading'),
  addRenderingDelay(1000),
  addStateHandlers(
    {
      isShowing: true,
    },
    {
      markNotShowing: () => () => ({
        isShowing: false,
      }),
    },
  ),
  addWrapper((render, {isShowing}) => (
    <Transition
      in={isShowing}
      mountOnEnter
      unmountOnExit
      appear
      addEndListener={(node, done) => {
        if (isShowing) {
          gsap.from(node, {
            duration: 0.3,
            opacity: 0,
            scale: 0.9,
            onComplete: done,
          })
        } else {
          gsap.to(node, {
            duration: 0.5,
            opacity: 0,
            scale: 0.7,
            onComplete: done,
            delay: 0.2,
          })
        }
      }}
    >
      {render()}
    </Transition>
  )),
  addExtendedHandlers({
    onFinished: ({markNotShowing}) => () => {
      markNotShowing()
    },
  }),
  addStateHandlers(
    {
      percent: 0,
    },
    {
      incrementPercent: ({percent}) => () => ({
        percent: percent + 1,
      }),
    },
  ),
  // eslint-disable-next-line ad-hok/dependencies
  addEffect(
    ({percent, incrementPercent, onFinished}) => () => {
      if (percent >= 100) {
        onFinished()
        return
      }
      delay(incrementPercent, random(200))
    },
    ['percent'],
  ),
  ({percent}) => (
    <div css={styles.container}>
      <span css={styles.percent}>{percent}%</span>
    </div>
  ),
)

export default Loading

const styles = makeStyles({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  percent: {
    fontFamily: 'lobster',
    fontSize: 84,
    color: colors.red,
    backgroundColor: atOpacity(0.92)(colors.white),
    padding: '0px 14px',
    borderRadius: 18,
  },
})
