'use strict';

var debug = require('debug')('dom-fit');
var defaults = require('defaults');
var fit = require('math-fit');
var transform = require('dom-transform');


module.exports = DomFit;

function DomFit(target, parent, options, callback) {
  if (!(this instanceof DomFit)) {
    return new DomFit(target, parent, options, callback);
  }

  this._target = target;
  this._parent = parent;

  if (typeof options === 'function') {
    this._callback = options;
    options = {};
  }

  if (typeof callback === 'function') {
    this._callback = callback;
  }

  this._options = defaults(options || {}, {
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
    contain: false
  });

  debug('options', this._options);

  this.resize = this.resize.bind(this);

  if (this._options.autoResize === true) {
    window.addEventListener('resize', this.resize, false);
    this.resize();
  }
}


DomFit.prototype.dispose = function() {
  debug('dispose');
  window.removeEventListener('resize', this.resize, false);
};


DomFit.prototype.resize = function() {
  var opt = this._options;
  var cb = this._callback;
  var target = this._target;
  var parent = this._parent;
  var targetStyle = target.style;

  if (transform.isSupported) {
    transform.none(target);
  } else {
    targetStyle.left = '';
    targetStyle.top = '';
    targetStyle.width = '';
    targetStyle.height = '';
  }

  var targetBox = target.getBoundingClientRect();
  var parentBox = parent.getBoundingClientRect
    ? parent.getBoundingClientRect()
    : { width: parent.innerWidth, height: parent.innerHeight };

  debug('targetBox', targetBox);
  debug('parentBox', parentBox);

  var value = fit[opt.contain ? 'contain' : 'cover']({
    w: targetBox.width || opt.defaultWidth,
    h: targetBox.height || opt.defaultHeight
  }, {
    w: parentBox.width,
    h: parentBox.height
  });

  value.left -= targetBox.left;
  value.top -= targetBox.top;

  if (cb) {
    cb(value);
    return;
  }

  if (transform.isSupported) {
    transform(target, {
      origin: '0 0',
      x: value.left,
      y: value.top,
      scale: value.scale,
    });
    return;
  }

  targetStyle.left = value.x + 'px';
  targetStyle.top = value.y + 'px';
  targetStyle.width = value.width + 'px';
  targetStyle.height = value.height + 'px';
};
