import {FC} from 'react'
import {flowMax, addRef, addProps, addDisplayName} from 'ad-hok'
import {branchIfNullish} from 'ad-hok-utils'
import {createPortal} from 'react-dom'
import {isString} from 'lodash'

import typedAs from 'utils/typedAs'
import addImmediateInitialRerendering from 'utils/addImmediateInitialRerendering'

interface Props {
  to: string | HTMLElement | null
}

const Portal: FC<Props> = flowMax(
  addDisplayName('Portal'),
  addRef('toRef', typedAs<HTMLElement | null>(null)),
  addImmediateInitialRerendering,
  addProps(({to, toRef}) => {
    if (!toRef.current) {
      toRef.current = isString(to) ? document.getElementById(to) : to
    }
    return {
      toElement: toRef.current,
    }
  }),
  branchIfNullish('toElement'),
  ({toElement, children}) => createPortal(children, toElement),
)

export default Portal
