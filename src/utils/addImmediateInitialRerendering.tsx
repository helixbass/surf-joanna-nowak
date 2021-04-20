import {SimpleUnchangedProps, flowMax, addState} from 'ad-hok'
import {addEffectOnMount} from 'ad-hok-utils'

const addImmediateInitialRerendering: SimpleUnchangedProps = flowMax(
  addState('_hasRendered', '_setHasRendered', false),
  addEffectOnMount(({_setHasRendered}) => () => {
    _setHasRendered(true)
  }),
)

export default addImmediateInitialRerendering
