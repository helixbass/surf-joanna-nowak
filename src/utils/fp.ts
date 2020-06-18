import {UnchangedProps} from 'ad-hok'

type TapType = <TProps>(
  callback: (props: TProps) => void,
) => UnchangedProps<TProps>

export const tap: TapType = (callback) => (props) => {
  callback(props)

  return props
}

type LogType = <TProps>(key: string) => UnchangedProps<TProps>

export const log: LogType = (key) => tap((props) => console.log({[key]: props}))

type WithoutIndexType = (index: number) => <TItem>(array: TItem[]) => TItem[]

export const withoutIndex: WithoutIndexType = (index) => (array) => [
  ...array.slice(0, index),
  ...array.slice(index + 1),
]
