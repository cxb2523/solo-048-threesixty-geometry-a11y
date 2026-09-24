import { expect } from 'chai';
import { normalizeIndex, dragDirection, spriteGrid, spriteOffset } from '../src/geometry.js';
import ThreeSixty from '../src/threesixty.js';

describe('Geometry', function () {
  describe('normalizeIndex', function () {
    it('should keep in-range indexes untouched', function () {
      expect(normalizeIndex(0, 31)).to.be.equal(0);
      expect(normalizeIndex(30, 31)).to.be.equal(30);
    });

    it('should wrap indexes beyond count', function () {
      expect(normalizeIndex(31, 31)).to.be.equal(0);
      expect(normalizeIndex(34, 31)).to.be.equal(3);
    });

    it('should normalize negative indexes', function () {
      expect(normalizeIndex(-1, 31)).to.be.equal(30);
    });

    it('should normalize negative indexes smaller than -count', function () {
      expect(normalizeIndex(-35, 31)).to.be.equal(27);
      expect(normalizeIndex(-62, 31)).to.be.equal(0);
    });

    it('should fall back to 0 for invalid counts', function () {
      expect(normalizeIndex(5, 0)).to.be.equal(0);
      expect(normalizeIndex(5, -3)).to.be.equal(0);
    });
  });

  describe('dragDirection', function () {
    it('should return 0 while within tolerance', function () {
      expect(dragDirection(100, 95, 10)).to.be.equal(0);
      expect(dragDirection(100, 90, 10)).to.be.equal(0);
    });

    it('should return -1 when dragged left beyond tolerance', function () {
      expect(dragDirection(100, 80, 10)).to.be.equal(-1);
    });

    it('should return 1 when dragged right beyond tolerance', function () {
      expect(dragDirection(100, 120, 10)).to.be.equal(1);
    });
  });

  describe('spriteGrid', function () {
    it('should compute columns and rows from perRow', function () {
      expect(spriteGrid(31, 4)).to.be.deep.equal({ columns: 4, rows: 8 });
    });

    it('should fall back to a single row when perRow is 0', function () {
      expect(spriteGrid(10, 0)).to.be.deep.equal({ columns: 10, rows: 1 });
    });
  });

  describe('spriteOffset', function () {
    it('should convert index to column/row offsets', function () {
      expect(spriteOffset(3, 4, 100, 50)).to.be.deep.equal({ x: -300, y: 0 });
      expect(spriteOffset(5, 4, 100, 50)).to.be.deep.equal({ x: -100, y: -50 });
    });

    it('should return finite zero offsets when columns is 0', function () {
      expect(spriteOffset(3, 0, 100, 50)).to.be.deep.equal({ x: 0, y: 0 });
    });
  });

  describe('goto normalization', function () {
    afterEach(function () {
      this.threesixty && this.threesixty.destroy();
      this.threesixty = null;
    });

    it('should normalize negative indexes smaller than -count', function () {
      this.threesixty = new ThreeSixty(document.getElementById('threesixty'), {
        image: 'sprite.jpg',
        count: 31,
        perRow: 4
      });

      this.threesixty.goto(-35);

      expect(this.threesixty.index).to.be.equal(27);
    });

    it('should never resolve to an undefined image', function () {
      const images = ['a.jpg', 'b.jpg', 'c.jpg', 'd.jpg'];
      const container = document.getElementById('threesixty');

      this.threesixty = new ThreeSixty(container, { image: images });

      this.threesixty.goto(-5);

      expect(this.threesixty.index).to.be.equal(3);
      expect(container.style.backgroundImage).to.be.equal(`url(${images[3]})`);
    });
  });
});
