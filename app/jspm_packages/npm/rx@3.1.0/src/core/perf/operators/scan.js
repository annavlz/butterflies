/* */ 
"format cjs";
  var ScanObservable = (function(__super__) {
    inherits(ScanObservable, __super__);
    function ScanObservable(source, accumulator, hasSeed, seed) {
      this.source = source;
      this.accumulator = accumulator;
      this.hasSeed = hasSeed;
      this.seed = seed;
      __super__.call(this);
    }

    ScanObservable.prototype.subscribeCore = function(o) {
      return this.source.subscribe(new InnerObserver(o,this));
    };

    return ScanObservable;
  }(ObservableBase));

  function InnerObserver(o, parent) {
    this.o = o;
    this.accumulator = parent.accumulator;
    this.hasSeed = parent.hasSeed;
    this.seed = parent.seed;
    this.hasAccumulation = false;
    this.accumulation = null;
    this.hasValue = false;
    this.isStopped = false;
  }
  InnerObserver.prototype = {
    onNext: function (x) {
      if (this.isStopped) { return; }
      !this.hasValue && (this.hasValue = true);
      if (this.hasAccumulation) {
        this.accumulation = tryCatch(this.accumulator)(this.accumulation, x);
      } else {
        this.accumulation = this.hasSeed ? tryCatch(this.accumulator)(this.seed, x) : x;
        this.hasAccumulation = true;
      }
      if (this.accumulation === errorObj) { return this.o.onError(this.accumulation.e); }
      this.o.onNext(this.accumulation);
    },
    onError: function (e) {
      if (!this.isStopped) {
        this.isStopped = true;
        this.o.onError(e);
      }
    },
    onCompleted: function () {
      if (!this.isStopped) {
        this.isStopped = true;
        !this.hasValue && this.hasSeed && this.o.onNext(this.seed);
        this.o.onCompleted();
      }
    },
    dispose: function() { this.isStopped = true; },
    fail: function (e) {
      if (!this.isStopped) {
        this.isStopped = true;
        this.o.onError(e);
        return true;
      }
      return false;
    }
  };

  /**
  *  Applies an accumulator function over an observable sequence and returns each intermediate result. The optional seed value is used as the initial accumulator value.
  *  For aggregation behavior with no intermediate results, see Observable.aggregate.
  * @param {Mixed} [seed] The initial accumulator value.
  * @param {Function} accumulator An accumulator function to be invoked on each element.
  * @returns {Observable} An observable sequence containing the accumulated values.
  */
  observableProto.scan = function () {
    var hasSeed = false, seed, accumulator = arguments[0];
    if (arguments.length === 2) {
      hasSeed = true;
      seed = arguments[1];
    }
    return new ScanObservable(this, accumulator, hasSeed, seed);
  };
