import {UnchangedProps, addEffect, addLayoutEffect} from 'ad-hok'

type AddEffectOnMountType = <TProps>(
  callback: (props: TProps) => () => void,
) => UnchangedProps<TProps>

const addEffectOnMount: AddEffectOnMountType = (callback) =>
  addEffect(callback, [])

export default addEffectOnMount

export const addLayoutEffectOnMount: AddEffectOnMountType = (callback) =>
  addLayoutEffect(callback, [])
