import { expect } from 'chai';
import ThreeSixty from '../src/threesixty.js';
import { createContainer } from './helpers.js';

const IMAGES = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg'];

function mouseEvent(type, x, pageX) {
  const event = new window.MouseEvent(type, { clientX: x, bubbles: true });
  if (pageX !== undefined) {
    Object.defineProperty(event, 'pageX', { value: pageX });
  }
  return event;
}

function touchEvent(type, x) {
  const event = new window.Event(type, { bubbles: true });
  event.touches = [{ clientX: x }];
  return event;
}

describe('Events', function () {
  beforeEach(function () {
    this.container = createContainer();
    this.threesixty = new ThreeSixty(this.container, {
      image: IMAGES,
      dragTolerance: 10,
      swipeTolerance: 10
    });
  });

  afterEach(function () {
    this.threesixty.destroy();
    this.container.remove();
  });

  it('steps one frame when the mouse drags past tolerance', function () {
    this.container.dispatchEvent(mouseEvent('mousedown', 100));
    window.dispatchEvent(mouseEvent('mousemove', 89));

    expect(this.threesixty.index).to.equal(3);

    window.dispatchEvent(mouseEvent('mousemove', 120));

    expect(this.threesixty.index).to.equal(0);
  });

  it('uses clientX for mouse events, not pageX', function () {
    this.container.dispatchEvent(mouseEvent('mousedown', 100, 500));
    window.dispatchEvent(mouseEvent('mousemove', 85, 500));

    expect(this.threesixty.index).to.equal(3);
  });

  it('steps one frame when a touch swipes past tolerance', function () {
    this.container.dispatchEvent(touchEvent('touchstart', 100));
    window.dispatchEvent(touchEvent('touchmove', 115));

    expect(this.threesixty.index).to.equal(1);
  });

  it('shares one coordinate space between mouse and touch', function () {
    this.container.dispatchEvent(mouseEvent('mousedown', 100));
    window.dispatchEvent(touchEvent('touchmove', 85));

    expect(this.threesixty.index).to.equal(3);
  });

  it('does not move before the tolerance is exceeded', function () {
    this.container.dispatchEvent(mouseEvent('mousedown', 100));
    window.dispatchEvent(mouseEvent('mousemove', 95));
    window.dispatchEvent(mouseEvent('mousemove', 105));

    expect(this.threesixty.index).to.equal(0);
  });

  it('ignores move events when no drag is in progress', function () {
    window.dispatchEvent(mouseEvent('mousemove', 500));
    window.dispatchEvent(touchEvent('touchmove', 500));

    expect(this.threesixty.index).to.equal(0);
  });

  it('stops reacting after destroy', function () {
    this.threesixty.destroy();

    this.container.dispatchEvent(mouseEvent('mousedown', 100));
    window.dispatchEvent(mouseEvent('mousemove', 50));

    expect(this.threesixty.index).to.equal(0);
  });

  describe('destroy', function () {
    it('removes every listener it attached to window', function () {
      const added = [];
      const removed = [];
      const originalAdd = window.addEventListener;
      const originalRemove = window.removeEventListener;

      window.addEventListener = function (type, listener, ...rest) {
        added.push({ type, listener });
        return originalAdd.call(this, type, listener, ...rest);
      };
      window.removeEventListener = function (type, listener, ...rest) {
        removed.push({ type, listener });
        return originalRemove.call(this, type, listener, ...rest);
      };

      const container = createContainer();
      const prev = document.createElement('button');
      const next = document.createElement('button');
      const threesixty = new ThreeSixty(container, {
        image: IMAGES,
        aspectRatio: 1,
        prev,
        next
      });

      threesixty.destroy();

      window.addEventListener = originalAdd;
      window.removeEventListener = originalRemove;
      container.remove();

      expect(added.length).to.be.greaterThan(0);
      added.forEach(({ type, listener }) => {
        const wasRemoved = removed.some((entry) => entry.type === type && entry.listener === listener);
        expect(wasRemoved, `window listener "${type}" should be removed`).to.equal(true);
      });
    });
  });
});
