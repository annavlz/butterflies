/* */ 
"use strict";

var _require = require("@cycle/core");

var Rx = _require.Rx;

var VirtualNode = require("virtual-dom/vnode/vnode");

/**
 * Converts a tree of VirtualNode|Observable<VirtualNode> into
 * Observable<VirtualNode>.
 */
function transposeVTree(vtree) {
  if (typeof vtree.subscribe === "function") {
    return vtree.flatMap(transposeVTree);
  } else if (vtree.type === "VirtualText") {
    return Rx.Observable.just(vtree);
  } else if (vtree.type === "VirtualNode" && Array.isArray(vtree.children) && vtree.children.length > 0) {
    return Rx.Observable.combineLatest(vtree.children.map(transposeVTree), function () {
      for (var _len = arguments.length, arr = Array(_len), _key = 0; _key < _len; _key++) {
        arr[_key] = arguments[_key];
      }

      return new VirtualNode(vtree.tagName, vtree.properties, arr, vtree.key, vtree.namespace);
    });
  } else if (vtree.type === "VirtualNode" || vtree.type === "Widget") {
    return Rx.Observable.just(vtree);
  } else {
    throw new Error("Unhandled case in transposeVTree()");
  }
}

module.exports = {
  transposeVTree: transposeVTree
};