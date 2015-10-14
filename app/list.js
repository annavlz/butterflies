import {Rx} from '@cycle/core';
import {h} from '@cycle/dom';
import item from './item';

function intent(DOM) {
  const addItem$ = DOM.select('.list .add-one-btn')
                  .events('click').map(() => 1)
  return { addItem$ }
}

function model(actions, itemFn) {
  function createNewItem(props) {
    const sinks = itemFn(props);
    sinks.DOM = sinks.DOM.replay(null, 1);
    sinks.DOM.connect();
    return {DOM: sinks.DOM};
  }

  const initialState = [createNewItem()]

  const addItemMod$ = actions.addItem$.map(amount => {
    let newItems = [];
    newItems.push(createNewItem());
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
    h('div.list',
      [h('button.add-one-btn', 'Add New Item')].concat(itemDOMs)
    )
  );
}

function makeItemWrapper(DOM) {
  return function itemWrapper() {
    const props$ =  Rx.Observable.just('blue')
    return item(props$);
  }
}

function list(sources, name = []) {
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
