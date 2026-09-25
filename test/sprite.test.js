import { expect } from 'chai';
import ThreeSixty from '../src/threesixty.js';
import { createContainer } from './helpers.js';

describe('Sprite fallbacks', function () {
  beforeEach(function () {
    this.container = createContainer();
  });

  afterEach(function () {
    this.threesixty.destroy();
    this.container.remove();
  });

  it('keeps background size finite when perRow is 0', function () {
    this.threesixty = new ThreeSixty(this.container, {
      image: 'sprite.jpg',
      width: 300,
      height: 300,
      count: 4,
      perRow: 0
    });

    expect(this.container.style.backgroundSize).to.equal('100% 400%');
    expect(this.container.style.backgroundSize).to.not.match(/Infinity|NaN/);
  });

  it('keeps background positions finite when perRow is 0', function () {
    this.threesixty = new ThreeSixty(this.container, {
      image: 'sprite.jpg',
      width: 300,
      height: 300,
      count: 4,
      perRow: 0
    });

    this.threesixty.goto(2);

    expect(this.container.style.backgroundPositionX).to.equal('0px');
    expect(this.container.style.backgroundPositionY).to.equal('-600px');
    expect(this.container.style.backgroundPositionX).to.not.match(/Infinity|NaN/);
    expect(this.container.style.backgroundPositionY).to.not.match(/Infinity|NaN/);
  });
});
