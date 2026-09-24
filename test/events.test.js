import { expect } from 'chai';
import ThreeSixty from '../src/threesixty.js';

const images = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg', 'f.jpg', 'g.jpg', 'h.jpg', 'i.jpg', 'j.jpg'];

function mouseEvent(type, x) {
  return new window.MouseEvent(type, { clientX: x, bubbles: true });
}

function touchEvent(type, x) {
  const event = new window.Event(type, { bubbles: true });
  event.touches = [{ clientX: x }];
  return event;
}

describe('Events', function () {
  beforeEach(function () {
    this.container = document.getElementById('threesixty');
    this.threesixty = new ThreeSixty(this.container, {
      image: images,
      dragTolerance: 10,
      swipeTolerance: 10
    });
  });

  afterEach(function () {
    this.threesixty.destroy();
  });

  it('should step frames with mouse drag using clientX', function () {
    this.container.dispatchEvent(mouseEvent('mousedown', 100));
    window.dispatchEvent(mouseEvent('mousemove', 80));

    expect(this.threesixty.index).to.be.equal(9);

    window.dispatchEvent(mouseEvent('mousemove', 60));

    expect(this.threesixty.index).to.be.equal(8);
  });

  it('should use the same coordinates for mouse and touch', function () {
    this.container.dispatchEvent(mouseEvent('mousedown', 100));
    window.dispatchEvent(mouseEvent('mousemove', 80));
    window.dispatchEvent(mouseEvent('mouseup', 80));

    expect(this.threesixty.index).to.be.equal(9);

    this.container.dispatchEvent(touchEvent('touchstart', 100));
    window.dispatchEvent(touchEvent('touchmove', 80));
    this.container.dispatchEvent(touchEvent('touchend', 80));

    expect(this.threesixty.index).to.be.equal(8);

    this.container.dispatchEvent(mouseEvent('mousedown', 100));
    window.dispatchEvent(mouseEvent('mousemove', 120));

    expect(this.threesixty.index).to.be.equal(9);

    this.container.dispatchEvent(touchEvent('touchstart', 100));
    window.dispatchEvent(touchEvent('touchmove', 120));

    expect(this.threesixty.index).to.be.equal(0);
  });

  it('should ignore movement within tolerance', function () {
    this.container.dispatchEvent(mouseEvent('mousedown', 100));
    window.dispatchEvent(mouseEvent('mousemove', 95));

    expect(this.threesixty.index).to.be.equal(0);
  });

  it('should remove all window listeners after destroy', function () {
    this.container.dispatchEvent(mouseEvent('mousedown', 100));
    this.container.dispatchEvent(touchEvent('touchstart', 100));

    this.threesixty.destroy();

    window.dispatchEvent(mouseEvent('mousemove', 10));
    window.dispatchEvent(mouseEvent('mouseup', 10));
    window.dispatchEvent(touchEvent('touchmove', 10));

    const keydown = (keyCode) => {
      const event = new window.KeyboardEvent('keydown', { bubbles: true });
      Object.defineProperty(event, 'keyCode', { value: keyCode });
      window.dispatchEvent(event);
    };

    keydown(37);
    keydown(39);
    keydown(36);
    keydown(35);

    expect(this.threesixty.index).to.be.equal(0);
  });
});
