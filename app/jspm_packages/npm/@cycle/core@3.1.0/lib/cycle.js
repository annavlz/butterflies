/* */ 
"use strict";

var Rx = require("rx");

function makeRequestProxies(drivers) {
  var requestProxies = {};
  for (var _name in drivers) {
    if (drivers.hasOwnProperty(_name)) {
      requestProxies[_name] = new Rx.ReplaySubject(1);
    }
  }
  return requestProxies;
}

function callDrivers(drivers, requestProxies) {
  var responses = {};
  for (var _name2 in drivers) {
    if (drivers.hasOwnProperty(_name2)) {
      responses[_name2] = drivers[_name2](requestProxies[_name2], _name2);
    }
  }
  return responses;
}

function attachDisposeToRequests(requests, replicationSubscription) {
  Object.defineProperty(requests, "dispose", {
    enumerable: false,
    value: function value() {
      replicationSubscription.dispose();
    }
  });
  return requests;
}

function makeDisposeResponses(responses) {
  return function dispose() {
    for (var _name3 in responses) {
      if (responses.hasOwnProperty(_name3) && typeof responses[_name3].dispose === "function") {
        responses[_name3].dispose();
      }
    }
  };
}

function attachDisposeToResponses(responses) {
  Object.defineProperty(responses, "dispose", {
    enumerable: false,
    value: makeDisposeResponses(responses)
  });
  return responses;
}

function logToConsoleError(err) {
  var target = err.stack || err;
  if (console && console.error) {
    console.error(target);
  }
}

function replicateMany(observables, subjects) {
  return Rx.Observable.create(function (observer) {
    var subscription = new Rx.CompositeDisposable();
    setTimeout(function () {
      for (var _name4 in observables) {
        if (observables.hasOwnProperty(_name4) && subjects.hasOwnProperty(_name4) && !subjects[_name4].isDisposed) {
          subscription.add(observables[_name4].doOnError(logToConsoleError).subscribe(subjects[_name4].asObserver()));
        }
      }
      observer.onNext(subscription);
    }, 1);

    return function dispose() {
      subscription.dispose();
      for (var x in subjects) {
        if (subjects.hasOwnProperty(x)) {
          subjects[x].dispose();
        }
      }
    };
  });
}

function isObjectEmpty(obj) {
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      return false;
    }
  }
  return true;
}

function run(main, drivers) {
  if (typeof main !== "function") {
    throw new Error("First argument given to Cycle.run() must be the 'main' " + "function.");
  }
  if (typeof drivers !== "object" || drivers === null) {
    throw new Error("Second argument given to Cycle.run() must be an object " + "with driver functions as properties.");
  }
  if (isObjectEmpty(drivers)) {
    throw new Error("Second argument given to Cycle.run() must be an object " + "with at least one driver function declared as a property.");
  }

  var requestProxies = makeRequestProxies(drivers);
  var responses = callDrivers(drivers, requestProxies);
  var requests = main(responses);
  var subscription = replicateMany(requests, requestProxies).subscribe();
  var requestsWithDispose = attachDisposeToRequests(requests, subscription);
  var responsesWithDispose = attachDisposeToResponses(responses);
  return [requestsWithDispose, responsesWithDispose];
}

var Cycle = {
  /**
   * Takes an `main` function and circularly connects it to the given collection
   * of driver functions.
   *
   * The `main` function expects a collection of "driver response" Observables
   * as input, and should return a collection of "driver request" Observables.
   * A "collection of Observables" is a JavaScript object where
   * keys match the driver names registered by the `drivers` object, and values
   * are Observables or a collection of Observables.
   *
   * @param {Function} main a function that takes `responses` as input
   * and outputs a collection of `requests` Observables.
   * @param {Object} drivers an object where keys are driver names and values
   * are driver functions.
   * @return {Array} an array where the first object is the collection of driver
   * requests, and the second object is the collection of driver responses, that
   * can be used for debugging or testing.
   * @function run
   */
  run: run,

  /**
   * A shortcut to the root object of
   * [RxJS](https://github.com/Reactive-Extensions/RxJS).
   * @name Rx
   */
  Rx: Rx
};

module.exports = Cycle;