import { dragDirection } from '../geometry.js';

function pointerX(event) {
  if (event.touches && event.touches.length) {
    return event.touches[0].clientX;
  }

  return event.clientX !== undefined ? event.clientX : event.pageX;
}

function isEditableTarget(target) {
  return !!target && (
    target.tagName === 'INPUT' ||
    target.tagName === 'TEXTAREA' ||
    target.tagName === 'SELECT' ||
    target.isContentEditable
  );
}

class Events {
  #dragOrigin = null;
  #options = null;

  #eventHandlers = null;

  constructor(threesixty, options) {
    this.#options = options;

    const dragTo = (position, tolerance) => {
      if (this.#dragOrigin === null) {
        return;
      }

      const direction = dragDirection(this.#dragOrigin, position, tolerance);

      if (direction !== 0) {
        threesixty.stop();
        direction < 0 ? threesixty.prev() : threesixty.next();
        this.#dragOrigin = position;
      }
    };

    this.#eventHandlers = {
      container: {
        mousedown: (e) => this.#dragOrigin = pointerX(e),
        touchstart: (e) => this.#dragOrigin = pointerX(e),
        touchend: () => this.#dragOrigin = null,
      },
      prev: {
        mousedown: (e) => {
          e.preventDefault();
          threesixty.play(true);
        },
        mouseup: (e) => {
          e.preventDefault();
          threesixty.stop();
        },
        touchstart: (e) => {
          e.preventDefault();
          threesixty.prev();
        }
      },
      next: {
        mousedown: (e) => {
          e.preventDefault();
          threesixty.play();
        },
        mouseup: (e) => {
          e.preventDefault();
          threesixty.stop();
        },
        touchstart: (e) => {
          e.preventDefault();
          threesixty.next();
        }
      },
      global: {
        mouseup: () => this.#dragOrigin = null,
        mousemove: (e) => dragTo(pointerX(e), this.#options.dragTolerance),
        touchmove: (e) => dragTo(pointerX(e), this.#options.swipeTolerance),
        keydown: (e) => {
          if (isEditableTarget(e.target)) {
            return;
          }

          switch (e.keyCode) {
            case 37:
              e.preventDefault();
              threesixty.prev();
              break;
            case 39:
              e.preventDefault();
              threesixty.next();
              break;
            case 36:
              e.preventDefault();
              threesixty.goto(0);
              break;
            case 35:
              e.preventDefault();
              threesixty.goto(-1);
              break;
          }
        }
      }
    };

    this._initEvents();
  }

  destroy() {
    this.#options.swipeTarget.removeEventListener('mousedown', this.#eventHandlers.container.mousedown);
    this.#options.swipeTarget.removeEventListener('touchstart', this.#eventHandlers.container.touchstart);
    this.#options.swipeTarget.removeEventListener('touchend', this.#eventHandlers.container.touchend);

    window.removeEventListener('mouseup', this.#eventHandlers.global.mouseup);
    window.removeEventListener('mousemove', this.#eventHandlers.global.mousemove);
    window.removeEventListener('touchmove', this.#eventHandlers.global.touchmove);
    window.removeEventListener('keydown', this.#eventHandlers.global.keydown);

    if (this.#options.prev) {
      this.#options.prev.removeEventListener('mousedown', this.#eventHandlers.prev.mousedown);
      this.#options.prev.removeEventListener('mouseup', this.#eventHandlers.prev.mouseup);
      this.#options.prev.removeEventListener('touchstart', this.#eventHandlers.prev.touchstart);
    }

    if (this.#options.next) {
      this.#options.next.removeEventListener('mousedown', this.#eventHandlers.next.mousedown);
      this.#options.next.removeEventListener('mouseup', this.#eventHandlers.next.mouseup);
      this.#options.next.removeEventListener('touchstart', this.#eventHandlers.next.touchstart);
    }
  }

  _initEvents() {
    if (this.#options.draggable) {
      this.#options.swipeTarget.addEventListener('mousedown', this.#eventHandlers.container.mousedown);
      window.addEventListener('mouseup', this.#eventHandlers.global.mouseup);
      window.addEventListener('mousemove', this.#eventHandlers.global.mousemove);
    }

    if (this.#options.swipeable) {
      this.#options.swipeTarget.addEventListener('touchstart', this.#eventHandlers.container.touchstart);
      this.#options.swipeTarget.addEventListener('touchend', this.#eventHandlers.container.touchend);
      window.addEventListener('touchmove', this.#eventHandlers.global.touchmove);
    }

    if (this.#options.keys) {
      window.addEventListener('keydown', this.#eventHandlers.global.keydown);
    }

    if (this.#options.prev) {
      this.#options.prev.addEventListener('mousedown', this.#eventHandlers.prev.mousedown);
      this.#options.prev.addEventListener('mouseup', this.#eventHandlers.prev.mouseup);
      this.#options.prev.addEventListener('touchstart', this.#eventHandlers.prev.touchstart);
    }

    if (this.#options.next) {
      this.#options.next.addEventListener('mousedown', this.#eventHandlers.next.mousedown);
      this.#options.next.addEventListener('mouseup', this.#eventHandlers.next.mouseup);
      this.#options.next.addEventListener('touchstart', this.#eventHandlers.next.touchstart);
    }
  }
}

export default Events;
