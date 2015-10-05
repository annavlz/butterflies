/* */ 
var AnonymousObservable = require('../internal/anonymousobservable');
var arrayInitialize = require('../helpers/initializearray');
var SingleAssignmentDisposable = require('../singleassignmentdisposable');
var CompositeDisposable - require('../compositedisposable');
var isPromise = require('../helpers/ispromise');
var observableFromPromise = require('./frompromise');

/**
 * Merges the specified observable sequences into one observable sequence by using the selector function whenever any of the observable sequences or Promises produces an element.
 * @returns {Observable} An observable sequence containing the result of combining elements of the sources using the specified result selector function.
 */
module.exports = function () {
  var len = arguments.length, args = new Array(len);
  for(var i = 0; i < len; i++) { args[i] = arguments[i]; }
  var resultSelector = args.pop();
  Array.isArray(args[0]) && (args = args[0]);

  return new AnonymousObservable(function (o) {
    var n = args.length,
      falseFactory = function () { return false; },
      hasValue = arrayInitialize(n, falseFactory),
      hasValueAll = false,
      isDone = arrayInitialize(n, falseFactory),
      values = new Array(n);

    function next(i) {
      hasValue[i] = true;
      if (hasValueAll || (hasValueAll = hasValue.every(identity))) {
        try {
          var res = resultSelector.apply(null, values);
        } catch (e) {
          return o.onError(e);
        }
        o.onNext(res);
      } else if (isDone.filter(function (x, j) { return j !== i; }).every(identity)) {
        o.onCompleted();
      }
    }

    function done (i) {
      isDone[i] = true;
      isDone.every(identity) && o.onCompleted();
    }

    var subscriptions = new Array(n);
    for (var idx = 0; idx < n; idx++) {
      (function (i) {
        var source = args[i], sad = new SingleAssignmentDisposable();
        isPromise(source) && (source = observableFromPromise(source));
        sad.setDisposable(source.subscribe(function (x) {
            values[i] = x;
            next(i);
          },
          function(e) { o.onError(e); },
          function () { done(i); }
        ));
        subscriptions[i] = sad;
      }(idx));
    }

    return new CompositeDisposable(subscriptions);
  });
};
