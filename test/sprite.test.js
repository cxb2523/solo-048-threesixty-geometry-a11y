import { expect } from 'chai';
import ThreeSixty from '../src/threesixty.js';

describe('Sprite fallback', function () {
  beforeEach(function () {
    this.container = document.getElementById('threesixty');
  });

  afterEach(function () {
    this.threesixty && this.threesixty.destroy();
    this.threesixty = null;
  });

  it('should keep background size finite when perRow is 0', function () {
    this.threesixty = new ThreeSixty(this.container, {
      image: 'sprite.jpg',
      width: 100,
      height: 100,
      count: 10,
      perRow: 0
    });

    expect(this.container.style.backgroundSize).to.be.equal('1000% 100%');
  });

  it('should keep background position finite when perRow is 0', function () {
    this.threesixty = new ThreeSixty(this.container, {
      image: 'sprite.jpg',
      width: 100,
      height: 100,
      count: 10,
      perRow: 0
    });

    this.threesixty.goto(3);

    expect(this.container.style.backgroundPositionX).to.be.equal('-300px');
    expect(this.container.style.backgroundPositionY).to.be.equal('0px');
  });
});
