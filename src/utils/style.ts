import {InterpolationWithTheme} from '@emotion/core'

type StylesObject = {
  [className: string]: InterpolationWithTheme<any>
}

export const makeStyles = (styles: StylesObject) => styles
