/* */ 
"format cjs";
  // Aliases
  var Observable = Rx.Observable,
    observableProto = Observable.prototype,
    AnonymousObservable = Rx.AnonymousObservable,
    observableThrow = Observable.throwError,
    observerCreate = Rx.Observer.create,
    SingleAssignmentDisposable = Rx.SingleAssignmentDisposable,
    CompositeDisposable = Rx.CompositeDisposable,
    AbstractObserver = Rx.internals.AbstractObserver,
    noop = Rx.helpers.noop,
    defaultComparer = Rx.internals.isEqual,
    inherits = Rx.internals.inherits,
    Enumerable = Rx.internals.Enumerable,
    Enumerator = Rx.internals.Enumerator,
    $iterator$ = Rx.iterator,
    doneEnumerator = Rx.doneEnumerator,
    bindCallback = Rx.internals.bindCallback;
