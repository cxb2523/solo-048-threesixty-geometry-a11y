import { expect } from 'chai';
import ThreeSixty from '../src/threesixty.js';
import { createContainer, fakeWindowTimers } from './helpers.js';

describe('Play loop', function () {
  beforeEach(function () {
    this.container = createContainer();
    this.timers = fakeWindowTimers();
  });

  afterEach(function () {
    this.threesixty.destroy();
    this.timers.restore();
    this.container.remove();
  });

  it('stops immediately when count is 1 and maxloops is 1', function () {
    this.threesixty = new ThreeSixty(this.container, {
      image: ['only.jpg'],
      speed: 10
    });

    this.threesixty.play(false, 1);

    expect(this.threesixty.looping).to.equal(false);
    expect(this.threesixty.nloops).to.equal(0);
    expect(this.threesixty.index).to.equal(0);
    expect(this.timers.pending).to.equal(0);
  });

  it('counts the first rotation towards maxloops', function () {
    this.threesixty = new ThreeSixty(this.container, {
      image: ['a.jpg', 'b.jpg', 'c.jpg'],
      speed: 10
    });

    this.threesixty.play(false, 1);

    expect(this.threesixty.looping).to.equal(true);
    expect(this.threesixty.index).to.equal(1);

    this.timers.tick();
    expect(this.threesixty.index).to.equal(2);
    expect(this.threesixty.looping).to.equal(true);

    this.timers.tick();
    expect(this.threesixty.index).to.equal(0);
    expect(this.threesixty.looping).to.equal(false);
    expect(this.timers.pending).to.equal(0);
  });

  it('stops after exactly maxloops complete rotations', function () {
    this.threesixty = new ThreeSixty(this.container, {
      image: ['a.jpg', 'b.jpg', 'c.jpg'],
      speed: 10
    });

    this.threesixty.play(false, 2);

    for (let i = 0; i < 4; i++) {
      this.timers.tick();
      expect(this.threesixty.looping).to.equal(true);
    }

    this.timers.tick();

    expect(this.threesixty.looping).to.equal(false);
    expect(this.threesixty.index).to.equal(0);
    expect(this.threesixty.nloops).to.equal(0);
    expect(this.timers.pending).to.equal(0);
  });

  it('resets the loop counter on every play', function () {
    this.threesixty = new ThreeSixty(this.container, {
      image: ['a.jpg', 'b.jpg', 'c.jpg'],
      speed: 10
    });

    this.threesixty.play(false, 1);
    this.timers.tick();
    this.timers.tick();
    expect(this.threesixty.looping).to.equal(false);

    this.threesixty.play(false, 1);
    expect(this.threesixty.looping).to.equal(true);

    this.timers.tick();
    expect(this.threesixty.looping).to.equal(true);

    this.timers.tick();
    expect(this.threesixty.looping).to.equal(false);
  });
});
