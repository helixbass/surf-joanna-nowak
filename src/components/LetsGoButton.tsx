import React, {FC} from 'react'
import {flowMax, addDisplayName, addWrapper} from 'ad-hok'
import {Transition} from 'react-transition-group'
import gsap from 'gsap'

import CenteredContainer from 'components/CenteredContainer'
import {makeStyles} from 'utils/style'
import {colors} from 'utils/colors'
import addRenderingDelay from 'utils/addRenderingDelay'

interface Props {
  onClick: () => void
}

const LetsGoButton: FC<Props> = flowMax(
  addDisplayName('LetsGoButton'),
  addRenderingDelay(200),
  addWrapper((render) => (
    <Transition
      in
      mountOnEnter
      appear
      addEndListener={(node, done) => {
        gsap.from(node, {
          duration: 0.9,
          opacity: 0,
          scale: 0.8,
          onComplete: done,
          ease: 'power3.out',
        })
      }}
    >
      {render()}
    </Transition>
  )),
  () => (
    <CenteredContainer>
      <button onClick={() => {}} css={styles.button}>
        Let’s go surfing!
      </button>
    </CenteredContainer>
  ),
)

export default LetsGoButton

const styles = makeStyles({
  button: {
    fontFamily: 'lobster',
    backgroundColor: colors.red,
    color: colors.white,
    fontSize: 50,
    padding: '4px 42px 14px',
    borderWidth: 6,
    borderStyle: 'solid',
    borderColor: colors.white,
    borderRadius: 24,
    opacity: 0.96,
    transition: 'all 0.3s ease-in-out',
    '&:hover': {
      // borderColor: colors.greenOffRoad,
      transform: 'scale(1.02)',
    },
    '&:active': {
      backgroundColor: colors.darkRed,
    },
  },
})
