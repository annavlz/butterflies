/** @jsx hJSX */

import {run, Rx} from '@cycle/core';
import {makeDOMDriver, hJSX} from '@cycle/dom';

function main(sources) {
  return { DOM: view(model(intent(sources.DOM))) }
}

run(main, {
  DOM: makeDOMDriver('body')
});


function intent(DOM) {
  return Rx.Observable.fromEvent(document, 'click')
}

function model(actions) {
  const addItem$ = actions.map(ev => {
    let list = []
    list.push({x: ev.pageX, y: ev.pageY})
    return function(listItems) {
      return listItems.concat(list)
    }
  })
  return Rx.Observable.from(addItem$)
    .startWith()
    .scan((acc, newI) => {
      acc.merge(newI)
      return acc
    })
    .publishValue({}).refCount()
}

function view(item$) {
  return item$.map(position => {
    console.log("position", position)
    const style = {
      width: '50px',
      top: String(position.y+'px'),
      left: String(position.x+'px'),
      position: 'absolute'
    }
    const source = './assets/image.gif'
    return <img src={source} style={style}/>
  })
}
