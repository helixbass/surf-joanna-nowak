import {
  UnchangedProps,
  flowMax,
  addStateHandlers,
  branch,
  renderNothing,
} from 'ad-hok'
import {addEffectOnMount, cleanupProps} from 'ad-hok-utils'
import {delay} from 'lodash'

type AddRenderingDelayType = <TProps>(delay: number) => UnchangedProps<TProps>

const addRenderingDelay: AddRenderingDelayType = (delayMs) =>
  flowMax(
    addStateHandlers(
      {
        isDoneWaiting: false,
      },
      {
        markDoneWaiting: () => () => ({
          isDoneWaiting: true,
        }),
      },
    ),
    addEffectOnMount(({markDoneWaiting}) => () => {
      delay(markDoneWaiting, delayMs)
    }),
    branch(({isDoneWaiting}) => !isDoneWaiting, renderNothing()),
    cleanupProps(['isDoneWaiting', 'markDoneWaiting']),
  )

export default addRenderingDelay
