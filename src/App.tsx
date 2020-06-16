import React, {FC} from 'react'
import {keyframes} from '@emotion/core'

import logo from './logo.svg'
import {makeStyles} from './utils/style'

const App: FC = () => (
  <div css={styles.app}>
    <header css={styles.appHeader}>
      <img src={logo} css={styles.appLogo} alt="logo" />
      <p>
        Edit <code>src/App.tsx</code> and save to reload.
      </p>
      <a
        css={styles.appLink}
        href="https://reactjs.org"
        target="_blank"
        rel="noopener noreferrer"
      >
        Learn React
      </a>
    </header>
  </div>
)

export default App

const appLogoSpin = keyframes({
  from: {
    transform: 'rotate(0deg)',
  },
  to: {
    transform: 'rotate(360deg)',
  },
})

const styles = makeStyles({
  appHeader: {
    backgroundColor: '#282c34',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 'calc(10px + 2vmin)',
    color: 'white',
  },
  appLink: {
    color: '#61dafb',
  },
  app: {
    textAlign: 'center',
  },
  appLogo: {
    height: '40vmin',
    pointerEvents: 'none',
    '@media (prefers-reduced-motion: no-preference)': {
      animation: `${appLogoSpin} infinite 20s linear`,
    },
  },
})
