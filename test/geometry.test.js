import { expect } from 'chai';
import {
  normalizeIndex,
  dragStep,
  pointerX,
  spritePerRow,
  spriteColumn,
  spriteRow,
  spriteGrid
} from '../src/geometry.js';
import ThreeSixty from '../src/threesixty.js';
import { createContainer } from './helpers.js';

describe('Geometry', function () {
  describe('normalizeIndex', function () {
    it('keeps in-range indexes untouched', function () {
      expect(normalizeIndex(0, 31)).to.equal(0);
      expect(normalizeIndex(15, 31)).to.equal(15);
      expect(normalizeIndex(30, 31)).to.equal(30);
    });

    it('wraps indexes beyond count', function () {
      expect(normalizeIndex(31, 31)).to.equal(0);
      expect(normalizeIndex(34, 31)).to.equal(3);
    });

    it('normalizes -1 to the last frame', function () {
      expect(normalizeIndex(-1, 31)).to.equal(30);
    });

    it('normalizes indexes more negative than -count', function () {
      expect(normalizeIndex(-31, 31)).to.equal(0);
      expect(normalizeIndex(-32, 31)).to.equal(30);
      expect(normalizeIndex(-63, 31)).to.equal(30);
      expect(normalizeIndex(-100, 4)).to.equal(0);
      expect(normalizeIndex(-101, 4)).to.equal(3);
    });

    it('falls back to 0 when count is not positive', function () {
      expect(normalizeIndex(5, 0)).to.equal(0);
      expect(normalizeIndex(-5, 0)).to.equal(0);
    });
  });

  describe('dragStep', function () {
    it('returns 0 while within tolerance', function () {
      expect(dragStep(100, 100, 10)).to.equal(0);
      expect(dragStep(100, 110, 10)).to.equal(0);
      expect(dragStep(100, 90, 10)).to.equal(0);
    });

    it('returns -1 when dragged left past tolerance', function () {
      expect(dragStep(100, 89, 10)).to.equal(-1);
    });

    it('returns 1 when dragged right past tolerance', function () {
      expect(dragStep(100, 111, 10)).to.equal(1);
    });

    it('returns 0 when the drag origin is not a number', function () {
      expect(dragStep(null, 200, 10)).to.equal(0);
      expect(dragStep(undefined, 200, 10)).to.equal(0);
      expect(dragStep(NaN, 200, 10)).to.equal(0);
    });
  });

  describe('pointerX', function () {
    it('reads clientX from mouse events', function () {
      expect(pointerX({ clientX: 5, pageX: 99 })).to.equal(5);
    });

    it('reads clientX from the first touch', function () {
      expect(pointerX({ touches: [{ clientX: 7 }], clientX: 1 })).to.equal(7);
    });

    it('falls back to changedTouches', function () {
      expect(pointerX({ touches: [], changedTouches: [{ clientX: 3 }] })).to.equal(3);
    });
  });

  describe('sprite column/row', function () {
    it('converts indexes to columns and rows', function () {
      expect(spriteColumn(5, 4)).to.equal(1);
      expect(spriteRow(5, 4)).to.equal(1);
      expect(spriteColumn(30, 4)).to.equal(2);
      expect(spriteRow(30, 4)).to.equal(7);
    });

    it('stays finite when perRow is 0', function () {
      expect(spritePerRow(0)).to.equal(1);
      expect(spriteColumn(3, 0)).to.equal(0);
      expect(spriteRow(3, 0)).to.equal(3);
    });

    it('computes sprite grid dimensions', function () {
      expect(spriteGrid(31, 4)).to.deep.equal({ cols: 4, rows: 8 });
      expect(spriteGrid(4, 0)).to.deep.equal({ cols: 1, rows: 4 });
    });
  });

  describe('goto normalization (integration)', function () {
    beforeEach(function () {
      this.container = createContainer();
    });

    afterEach(function () {
      this.threesixty.destroy();
      this.container.remove();
    });

    it('never resolves to an undefined image in array mode', function () {
      const images = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg'];
      this.threesixty = new ThreeSixty(this.container, { image: images });

      this.threesixty.goto(-5);

      expect(this.threesixty.index).to.equal(3);
      expect(this.container.style.backgroundImage).to.equal('url(d.jpg)');
      expect(this.container.style.backgroundImage).to.not.contain('undefined');
    });

    it('normalizes large negative indexes in sprite mode', function () {
      this.threesixty = new ThreeSixty(this.container, {
        image: 'sprite.jpg',
        width: 320,
        height: 320,
        count: 31,
        perRow: 4
      });

      this.threesixty.goto(-32);

      expect(this.threesixty.index).to.equal(30);
      expect(this.container.style.backgroundPositionX).to.equal('-640px');
      expect(this.container.style.backgroundPositionY).to.equal('-2240px');
    });
  });
});
