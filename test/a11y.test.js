import { expect } from 'chai';
import ThreeSixty from '../src/threesixty.js';

const images = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg', 'e.jpg'];

function keydown(keyCode, target) {
  const event = new window.KeyboardEvent('keydown', { bubbles: true });
  Object.defineProperty(event, 'keyCode', { value: keyCode });
  (target || window).dispatchEvent(event);
}

describe('Accessibility', function () {
  beforeEach(function () {
    this.container = document.getElementById('threesixty');
    this.threesixty = new ThreeSixty(this.container, { image: images });
  });

  afterEach(function () {
    this.threesixty.destroy();
  });

  it('should expose slider semantics on the container', function () {
    expect(this.container.getAttribute('tabindex')).to.be.equal('0');
    expect(this.container.getAttribute('role')).to.be.equal('slider');
    expect(this.container.getAttribute('aria-valuemin')).to.be.equal('0');
    expect(this.container.getAttribute('aria-valuemax')).to.be.equal('4');
    expect(this.container.getAttribute('aria-valuenow')).to.be.equal('0');
  });

  it('should update aria-valuenow when the frame changes', function () {
    this.threesixty.goto(2);

    expect(this.container.getAttribute('aria-valuenow')).to.be.equal('2');
  });

  it('should step one frame with arrow keys', function () {
    keydown(39);

    expect(this.threesixty.index).to.be.equal(1);

    keydown(37);

    expect(this.threesixty.index).to.be.equal(0);
  });

  it('should jump to first and last frame with Home and End', function () {
    keydown(35);

    expect(this.threesixty.index).to.be.equal(4);

    keydown(36);

    expect(this.threesixty.index).to.be.equal(0);
  });

  it('should not steal arrow keys from inputs', function () {
    const input = document.createElement('input');
    document.body.appendChild(input);

    keydown(39, input);
    keydown(37, input);
    keydown(36, input);
    keydown(35, input);

    expect(this.threesixty.index).to.be.equal(0);

    input.remove();
  });

  it('should remove slider semantics after destroy', function () {
    this.threesixty.destroy();

    expect(this.container.hasAttribute('tabindex')).to.be.equal(false);
    expect(this.container.hasAttribute('role')).to.be.equal(false);
    expect(this.container.hasAttribute('aria-valuenow')).to.be.equal(false);
  });
});
