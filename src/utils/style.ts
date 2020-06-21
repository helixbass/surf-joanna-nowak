import {InterpolationWithTheme} from '@emotion/core'

type StylesObject = {
  [className: string]: InterpolationWithTheme<any>
}

export const makeStyles = <TStyles extends StylesObject>(styles: TStyles) =>
  styles

export const sharedStyles = makeStyles({
  centeredContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
