/** @jsx hJSX */

import {run, Rx} from '@cycle/core';
import {makeDOMDriver, h, hJSX} from '@cycle/dom';
import combineLatestObj from 'rx-combine-latest-obj'

function main(sources) {
  console.log('main')
  return butterflies(sources)
}

run(main, {
  DOM: makeDOMDriver('body')
});




function intent(DOM) {
  const click$ = Rx.Observable.fromEvent(document, 'click')
  console.log('intent')
  return click$
}

function model(actions) {
  const source$ = Rx.Observable.just('./assets/image.gif')
  const position$ = actions.map(ev => {
      return {x: ev.pageX, y: ev.pageY}
  })
  return combineLatestObj({source$, position$})
}

function view(item$) {
  console.log('view')
  return item$.map(({source, position}) => {
    const style = {
      width: '50px',
      top: String(position.y+'px'),
      left: String(position.x+'px'),
      position: 'absolute'
    };
    console.log(style)
    return <img src={source} style={style}/>
  })
}

function butterflies (sources) {
  const actions = intent(sources.DOM)
  const item$ = model(actions)
  const vtree$ = view(item$)

  return console.log('butterfly'), {
    DOM: vtree$
  }
}

