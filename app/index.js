/** @jsx hJSX */

import {run} from '@cycle/core';
import {makeDOMDriver, hJSX} from '@cycle/dom';
import butterflies from './butterflies'

function main(sources) {
  return butterflies(sources)
}

run(main, {
 DOM: makeDOMDriver('#main-container')
});
