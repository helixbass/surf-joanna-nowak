import React, {FC} from 'react'
import {flowMax, addDisplayName} from 'ad-hok'

import {makeStyles, colors} from 'utils/style'

const CIRCLE_WIDTH = 400

const App: FC = flowMax(addDisplayName('App'), () => (
  <div css={styles.container}>
    <svg
      height={CIRCLE_WIDTH}
      width={CIRCLE_WIDTH}
      viewBox={`0 0 ${CIRCLE_WIDTH} ${CIRCLE_WIDTH}`}
    >
      <circle
        cx={CIRCLE_WIDTH / 2}
        cy={CIRCLE_WIDTH / 2}
        r={CIRCLE_WIDTH / 2}
        fill={colors.white}
      />
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
