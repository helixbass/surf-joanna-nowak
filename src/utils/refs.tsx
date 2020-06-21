import {flowMax, addState, addHandlers, SimplePropsAdder} from 'ad-hok'
import {set as setMutate} from 'lodash'
import {cleanupProps} from 'ad-hok-utils'

export type ElementRef = HTMLElement | SVGElement | null
export type Refs = {
  [name: string]: ElementRef
}

type AddRefsType = SimplePropsAdder<{
  refs: Refs
  setRef: (name: string) => (ref: ElementRef) => void
}>

export const addRefs: AddRefsType = flowMax(
  addState('refs', 'setRefs', {} as Refs),
  addHandlers({
    setRef: ({refs}) => (name: string) => (ref: ElementRef) => {
      setMutate(refs, name, ref)
    },
  }),
  cleanupProps(['setRefs']),
)
