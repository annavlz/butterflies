/** @jsx hJSX */
import Cycle from '@cycle/core';
import {makeDOMDriver, hJSX} from '@cycle/dom';

function main(responses) {
  let none = {
    display: none
  }
  let block = {
    display: block
  }
  let requests = {
    DOM: responses.DOM.select('input').events('change')
      .map(ev => ev.target.checked)
      .startWith(false)
      .map(toggled =>
          <div>
            <input type="checkbox" /> Toggle me
            <p>{ toggled ? 'ON' : 'off' }</p>
              { toggled ? <img src={'./assets/image.gif'} /> : '' }
          </div>
      )
  };
  return requests;
}

Cycle.run(main, {
 DOM: makeDOMDriver('#main-container')
});
