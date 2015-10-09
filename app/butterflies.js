/** @jsx hJSX */

import {Rx} from '@cycle/core';
import {h, hJSX} from '@cycle/dom';
import combineLatestObj from 'rx-combine-latest-obj'

function intent(DOM) {
  const click$ = Rx.Observable.create(
    DOM.select('body').events('click')
  )

  return click$
}

function model(actions) {
  const source$ = Rx.Observable.just('./assets/image.gif')
  const position$ = actions.map(ev => {
      return {x: ev.pageX, y: ev.pageY}
  })
  return combineLatestObj({source, position$})
}

function view(item$) {
  return item$.map(({source, position}) => {
    const style = {
      top: position.y,
      left: position.x,
      position: absolute
    };
    return h('img', {src: {source}}, {style})
  })
}

function butterflies (sources) {
  const actions = intent(sources.DOM)
  const item$ = model(actions)
  const vtree$ = view(item$)

  return {
    DOM: vtree$
  }
}

export default butterflies
