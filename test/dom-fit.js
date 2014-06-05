/*global describe, it, beforeEach, afterEach, Event */

var assert = require('assert');
var fit = require('dom-fit');
var container;

require('debug').enable('dom-fit');

function createElement(w, h) {
  var el = document.createElement('div');
  el.style.width = (w || 120) + 'px';
  el.style.height = (h || 100) + 'px';
  container.appendChild(el);

  return el;
}

function dispatchResize() {
  window.dispatchEvent(new Event('resize'));
}

describe('dom-fit', function() {
  beforeEach(function() {
    container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = window.innerWidth + 'px';
    container.style.height = window.innerHeight + 'px';
    document.body.appendChild(container);
  });

  afterEach(function() {
    document.body.removeChild(container);
  });


  it('should return transform values and not translate the element', function(done) {
    var target = createElement();

    var f = fit(target, container, function(values) {
      assert.equal(!isNaN(values.left), true);
      assert.equal(!isNaN(values.top), true);
      assert.equal(!isNaN(values.width), true);
      assert.equal(!isNaN(values.height), true);
      assert.equal(!isNaN(values.scale), true);

      var box = target.getBoundingClientRect();
      assert.equal(box.left, 0);
      assert.equal(box.top, 0);
      assert.equal(box.width, 120);
      assert.equal(box.height, 100);

      done();
    });

    f.resize();
  });


  it('should apply transform value', function(done) {
    var contBox = container.getBoundingClientRect();
    var target = createElement();

    var f = fit(target, container);

    var box = target.getBoundingClientRect();
    assert.equal(box.left, 0);
    assert.equal(box.top, 0);
    assert.equal(box.width, 120);
    assert.equal(box.height, 100);

    f.resize();

    box = target.getBoundingClientRect();

    assert.equal(box.width === contBox.width || box.height === contBox.height, true);
    assert.equal(box.width >= contBox.width && box.height >= contBox.height, true);

    done();
  });


  it('should listen resize event', function(done) {
    var target = createElement();

    fit(target, container, {
      autoResize: true
    }, function(values) {
      assert.equal(typeof values, 'object');
      done();
    });
  });


  it('should remove resize listener', function(done) {
    var target = createElement();
    var i = 0;
    var called = 0;

    window.addEventListener('resize', resizeCalled, false);

    var f = fit(target, container, {
      autoResize: true
    }, function() {
      called++;
    });

    dispatchResize();
    f.dispose();
    dispatchResize();

    function resizeCalled() {
      i++;

      if (i === 2) {
        assert.equal(called, 2);
        window.removeEventListener('resize', resizeCalled, false);
        done();
      }
    }
  });

});
