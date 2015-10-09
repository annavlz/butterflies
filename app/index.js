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
  const list = []
  const list$ = Rx.Observable.from(list).subscribe
  const position$ = actions.map(ev => {
      list.push({x: ev.pageX, y: ev.pageY})
      list$.map(obj => console.log(obj))
      return {x: ev.pageX, y: ev.pageY}

  })

  return position$
}

function view(item$) {
  console.log('view')
  return item$.map(position => {
    console.log("position", position)
    const style = {
      width: '50px',
      top: String(position.y+'px'),
      left: String(position.x+'px'),
      position: 'absolute'
    };
    const source = './assets/image.gif'
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

