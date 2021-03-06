/* */ 
"use strict";
var _require = require("./custom-element-widget");
var makeWidgetClass = _require.makeWidgetClass;
var Map = Map || require("es6-map");
function replaceCustomElementsWithSomething(vtree, registry, toSomethingFn) {
  if (!vtree) {
    return vtree;
  }
  var tagName = (vtree.tagName || "").toUpperCase();
  if (tagName && registry.has(tagName)) {
    var WidgetClass = registry.get(tagName);
    return toSomethingFn(vtree, WidgetClass);
  }
  if (Array.isArray(vtree.children)) {
    for (var i = vtree.children.length - 1; i >= 0; i--) {
      vtree.children[i] = replaceCustomElementsWithSomething(vtree.children[i], registry, toSomethingFn);
    }
  }
  return vtree;
}
function makeCustomElementsRegistry(definitions) {
  var registry = new Map();
  for (var tagName in definitions) {
    if (definitions.hasOwnProperty(tagName)) {
      registry.set(tagName.toUpperCase(), makeWidgetClass(tagName, definitions[tagName]));
    }
  }
  return registry;
}
module.exports = {
  replaceCustomElementsWithSomething: replaceCustomElementsWithSomething,
  makeCustomElementsRegistry: makeCustomElementsRegistry
};
