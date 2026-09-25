export function createContainer() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return container;
}

export function fakeWindowTimers() {
  const callbacks = new Map();
  let nextId = 1;

  const originalSetTimeout = window.setTimeout;
  const originalClearTimeout = window.clearTimeout;

  window.setTimeout = (callback) => {
    const id = nextId++;
    callbacks.set(id, callback);
    return id;
  };
  window.clearTimeout = (id) => {
    callbacks.delete(id);
  };

  return {
    tick() {
      const pending = [...callbacks.values()];
      callbacks.clear();
      pending.forEach((callback) => callback());
    },
    get pending() {
      return callbacks.size;
    },
    restore() {
      window.setTimeout = originalSetTimeout;
      window.clearTimeout = originalClearTimeout;
    }
  };
}
