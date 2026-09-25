"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dragStep = dragStep;
exports.normalizeIndex = normalizeIndex;
exports.pointerX = pointerX;
exports.spriteColumn = spriteColumn;
exports.spriteGrid = spriteGrid;
exports.spritePerRow = spritePerRow;
exports.spriteRow = spriteRow;
/**
 * Pure geometry helpers for ThreeSixty.
 *
 * Every function in this module operates on plain numbers and returns
 * numbers. They hold no state and never touch the DOM, which makes the
 * frame math testable in isolation.
 */

/**
 * Wraps an arbitrary frame index into the [0, count) range.
 *
 * Unlike `(count + index) % count`, this stays correct for indexes that
 * are more negative than -count (where the naive expression still yields
 * a negative remainder in JS).
 *
 * @param {number} index Frame index, may be negative or larger than count.
 * @param {number} count Total number of frames.
 * @returns {number} Normalized index in [0, count), or 0 when count <= 0.
 */
function normalizeIndex(index, count) {
  if (!Number.isFinite(count) || count <= 0) {
    return 0;
  }
  return (index % count + count) % count;
}

/**
 * Decides how a drag moved the frame pointer.
 *
 * @param {number} originX Pointer x position where the current step started.
 * @param {number} currentX Pointer x position now.
 * @param {number} tolerance Minimum horizontal distance (px) before a step.
 * @returns {number} -1 when dragged left past tolerance (previous frame),
 *   1 when dragged right past tolerance (next frame), 0 otherwise.
 */
function dragStep(originX, currentX, tolerance) {
  if (!Number.isFinite(originX) || !Number.isFinite(currentX)) {
    return 0;
  }
  var delta = currentX - originX;
  if (Math.abs(delta) <= tolerance) {
    return 0;
  }
  return delta < 0 ? -1 : 1;
}

/**
 * Extracts a unified horizontal pointer coordinate from a mouse or touch
 * event. Both event kinds expose `clientX`, so that is the single
 * coordinate space used for dragging and swiping.
 *
 * @param {MouseEvent|TouchEvent} event
 * @returns {number} Pointer x position, or undefined when unavailable.
 */
function pointerX(event) {
  if (event.touches && event.touches.length > 0) {
    return event.touches[0].clientX;
  }
  if (event.changedTouches && event.changedTouches.length > 0) {
    return event.changedTouches[0].clientX;
  }
  return event.clientX;
}

/**
 * Effective number of sprite columns per row. Falls back to 1 when
 * perRow is missing or invalid, so column/row math never produces
 * Infinity or NaN.
 *
 * @param {number} perRow Configured frames per sprite row.
 * @returns {number} A positive integer.
 */
function spritePerRow(perRow) {
  return Number.isFinite(perRow) && perRow > 0 ? perRow : 1;
}

/**
 * Column of a frame inside the sprite sheet.
 *
 * @param {number} index Normalized frame index.
 * @param {number} perRow Configured frames per sprite row.
 * @returns {number} Zero-based column.
 */
function spriteColumn(index, perRow) {
  return index % spritePerRow(perRow);
}

/**
 * Row of a frame inside the sprite sheet.
 *
 * @param {number} index Normalized frame index.
 * @param {number} perRow Configured frames per sprite row.
 * @returns {number} Zero-based row.
 */
function spriteRow(index, perRow) {
  return Math.floor(index / spritePerRow(perRow));
}

/**
 * Grid dimensions of the sprite sheet, used for background-size.
 *
 * @param {number} count Total number of frames.
 * @param {number} perRow Configured frames per sprite row.
 * @returns {{cols: number, rows: number}} Always finite, at least 1x1.
 */
function spriteGrid(count, perRow) {
  var cols = spritePerRow(perRow);
  var rows = Math.max(1, Math.ceil(count / cols));
  return {
    cols: cols,
    rows: rows
  };
}