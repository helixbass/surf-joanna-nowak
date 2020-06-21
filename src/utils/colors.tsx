import colorUtil from 'color'

export type Color = string

export const colors = {
  blueBackground: '#d2dfd9',
  white: '#fcf9e9',
  blueRoad: '#21325f',
  greenOffRoad: '#7a9da5',
  red: '#f1555b',
}

export const atOpacity = (opacity: number) => (color: Color): Color =>
  colorUtil(color)
    .fade(1 - opacity)
    .toString()
