/** @jsx hJSX */

import {Rx} from '@cycle/core';
import {h, hJSX} from '@cycle/dom';
import item from './item';

function intent(DOM) {
  const addItem$ = Rx.Observable.fromEvent(document, 'click')
                    .map(ev => {return {x: ev.pageX, y: ev.pageY}})
  return addItem$
}

function model(actions, itemFn) {

  function createNewItem(props) {
    const sinks = itemFn(props);
    sinks.DOM = sinks.DOM.replay(null, 1);
    sinks.DOM.connect();
    return {DOM: sinks.DOM};
  }

  const initialState = [createNewItem({x: 100, y:100})]

  const addItemMod$ = actions.map(ev => {
    let newItems = [];
    newItems.push(createNewItem({x: ev.x, y: ev.y}));
    return function (listItems) {
      return listItems.concat(newItems);
    };
  });

  return Rx.Observable.merge(addItemMod$)
    .startWith(initialState)
    .scan((listItems, modification) => modification(listItems))
    .publishValue(initialState).refCount();
}

function view(itemDOMs$) {
  return itemDOMs$.map(itemDOMs =>
    h('div.list', itemDOMs)
  );
}

function makeItemWrapper(DOM) {
  return function itemWrapper(props) {
    const propsObservables = {
      x$: Rx.Observable.just(props.x),
      y$: Rx.Observable.just(props.y)
    }
    return item({props: propsObservables});
  }
}

function list(sources) {
  const actions = intent(sources.DOM);
  const itemWrapper = makeItemWrapper(sources.DOM);
  const items$ = model(actions, itemWrapper);
  const itemDOMs$ = items$.map(items => items.map(item => item.DOM));
  const vtree$ = view(itemDOMs$);

  return {
    DOM: vtree$
  };
}

export default list;
