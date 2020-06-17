import {InterpolationWithTheme} from '@emotion/core'

type StylesObject = {
  [className: string]: InterpolationWithTheme<any>
}

export const makeStyles = <TStyles extends StylesObject>(styles: TStyles) =>
  styles

export const colors = {
  blueBackground: '#d2dfd9',
  white: '#fcf9e9',
  blueRoad: '#21325f',
}
