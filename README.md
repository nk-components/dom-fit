# dom-fit

Fit a DOM element into another

## Installation

With [npm](http://npmjs.org) do:

```bash
$ npm install dom-fit --save
```

Install with [component(1)](http://component.io):

```bash
$ component install nk-components/dom-fit
```

# Usage

```js
var domFit = require('dom-fit');
var inner = document.querySelector('#inner');
var outer = document.querySelector('#outer');

var fit = domFit(inner, outer, {
  /**
   * If the module listen `resize` event.
   * If it's set to false, you have to call `.resize()`.
   *
   * Optional
   * @type Boolean
   */
  autoResize: false,
  /**
   * If the element is not visible or not added to the DOM,
   * its width & height will be equal to 0.
   * You can specify its default size to be able to resize
   * the element before to add it to the DOM.
   *
   * Optional
   * @type Float
   */
  defaultWidth: null,
  defaultHeight: null,
  /**
   * Contain or cover the parent.
   *
   * Optional
   * @type Boolean
   */
  contain: true
});

// autoResize === false, then we have to call `.resize()`
// to fit the inner element.
fit.resize();
```

## License

The MIT License (MIT)
