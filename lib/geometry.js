"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.dragDirection = dragDirection;
exports.normalizeIndex = normalizeIndex;
exports.spriteGrid = spriteGrid;
exports.spriteOffset = spriteOffset;
function normalizeIndex(index, count) {
  if (!Number.isFinite(count) || count <= 0) {
    return 0;
  }
  return (index % count + count) % count;
}
function dragDirection(origin, position, tolerance) {
  var delta = origin - position;
  if (Math.abs(delta) <= tolerance) {
    return 0;
  }
  return delta > 0 ? -1 : 1;
}
function spriteGrid(count, perRow) {
  var frames = Number.isFinite(count) && count > 0 ? count : 0;
  var columns = perRow > 0 ? perRow : Math.max(frames, 1);
  var rows = frames > 0 ? Math.ceil(frames / columns) : 1;
  return {
    columns: columns,
    rows: rows
  };
}
function spriteOffset(index, columns, width, height) {
  if (!Number.isFinite(columns) || columns <= 0) {
    return {
      x: 0,
      y: 0
    };
  }
  return {
    x: -(index % columns) * width + 0,
    y: -Math.floor(index / columns) * height + 0
  };
}