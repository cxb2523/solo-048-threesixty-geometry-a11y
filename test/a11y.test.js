import { expect } from 'chai';
import ThreeSixty from '../src/threesixty.js';
import { createContainer } from './helpers.js';

const IMAGES = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg'];

function keydown(target, key) {
  target.dispatchEvent(new window.KeyboardEvent('keydown', { key, bubbles: true }));
}

describe('Accessibility', function () {
  beforeEach(function () {
    this.container = createContainer();
    this.threesixty = new ThreeSixty(this.container, { image: IMAGES });
  });

  afterEach(function () {
    this.threesixty.destroy();
    this.container.remove();
  });

  it('exposes slider semantics on the container', function () {
    expect(this.container.getAttribute('tabindex')).to.equal('0');
    expect(this.container.getAttribute('role')).to.equal('slider');
    expect(this.container.getAttribute('aria-valuemin')).to.equal('0');
    expect(this.container.getAttribute('aria-valuemax')).to.equal('3');
    expect(this.container.getAttribute('aria-valuenow')).to.equal('0');
    expect(this.container.hasAttribute('aria-label')).to.equal(true);
  });

  it('keeps aria-valuenow in sync with the current frame', function () {
    this.threesixty.next();
    expect(this.container.getAttribute('aria-valuenow')).to.equal('1');

    this.threesixty.goto(3);
    expect(this.container.getAttribute('aria-valuenow')).to.equal('3');
  });

  it('steps one frame with arrow keys', function () {
    keydown(this.container, 'ArrowRight');
    expect(this.threesixty.index).to.equal(1);

    keydown(this.container, 'ArrowRight');
    expect(this.threesixty.index).to.equal(2);

    keydown(this.container, 'ArrowLeft');
    expect(this.threesixty.index).to.equal(1);
  });

  it('jumps to first and last frame with Home and End', function () {
    this.threesixty.goto(2);

    keydown(this.container, 'End');
    expect(this.threesixty.index).to.equal(3);

    keydown(this.container, 'Home');
    expect(this.threesixty.index).to.equal(0);
  });

  it('ignores arrow keys coming from editable elements', function () {
    const input = document.createElement('input');
    this.container.appendChild(input);

    keydown(input, 'ArrowRight');
    keydown(input, 'Home');

    expect(this.threesixty.index).to.equal(0);
  });

  it('still handles arrows from non-editable children', function () {
    const span = document.createElement('span');
    this.container.appendChild(span);

    keydown(span, 'ArrowRight');

    expect(this.threesixty.index).to.equal(1);
  });

  it('does not bind keyboard controls when keys is false', function () {
    this.threesixty.destroy();

    const container = createContainer();
    const threesixty = new ThreeSixty(container, { image: IMAGES, keys: false });

    keydown(container, 'ArrowRight');

    expect(threesixty.index).to.equal(0);

    threesixty.destroy();
    container.remove();
  });

  it('removes accessibility attributes on destroy', function () {
    this.threesixty.destroy();

    expect(this.container.hasAttribute('tabindex')).to.equal(false);
    expect(this.container.hasAttribute('role')).to.equal(false);
    expect(this.container.hasAttribute('aria-valuemin')).to.equal(false);
    expect(this.container.hasAttribute('aria-valuemax')).to.equal(false);
    expect(this.container.hasAttribute('aria-valuenow')).to.equal(false);
    expect(this.container.hasAttribute('aria-label')).to.equal(false);
  });
});
