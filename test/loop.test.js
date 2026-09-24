import { expect } from 'chai';
import ThreeSixty from '../src/threesixty.js';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('Playback loop', function () {
  beforeEach(function () {
    this.container = document.getElementById('threesixty');
  });

  afterEach(function () {
    this.threesixty && this.threesixty.destroy();
    this.threesixty = null;
  });

  it('should stop after maxloops when count is 1', async function () {
    this.threesixty = new ThreeSixty(this.container, {
      image: 'sprite.jpg',
      count: 1,
      perRow: 1,
      speed: 5
    });

    let ticks = 0;
    const next = this.threesixty.next.bind(this.threesixty);
    this.threesixty.next = () => { ticks += 1; next(); };

    this.threesixty.play(false, 2);

    await wait(150);

    expect(this.threesixty.looping).to.be.equal(false);
    expect(ticks).to.be.equal(2);
  });

  it('should count the first loop towards maxloops', async function () {
    this.threesixty = new ThreeSixty(this.container, {
      image: 'sprite.jpg',
      count: 4,
      perRow: 2,
      speed: 5
    });

    let ticks = 0;
    const next = this.threesixty.next.bind(this.threesixty);
    this.threesixty.next = () => { ticks += 1; next(); };

    this.threesixty.play(false, 2);

    await wait(200);

    expect(this.threesixty.looping).to.be.equal(false);
    expect(ticks).to.be.equal(8);
  });
});
