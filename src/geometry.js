export function normalizeIndex(index, count) {
  if (!Number.isFinite(count) || count <= 0) {
    return 0;
  }

  return ((index % count) + count) % count;
}

export function dragDirection(origin, position, tolerance) {
  const delta = origin - position;

  if (Math.abs(delta) <= tolerance) {
    return 0;
  }

  return delta > 0 ? -1 : 1;
}

export function spriteGrid(count, perRow) {
  const frames = Number.isFinite(count) && count > 0 ? count : 0;
  const columns = perRow > 0 ? perRow : Math.max(frames, 1);
  const rows = frames > 0 ? Math.ceil(frames / columns) : 1;

  return { columns, rows };
}

export function spriteOffset(index, columns, width, height) {
  if (!Number.isFinite(columns) || columns <= 0) {
    return { x: 0, y: 0 };
  }

  return {
    x: -(index % columns) * width + 0,
    y: -Math.floor(index / columns) * height + 0
  };
}
