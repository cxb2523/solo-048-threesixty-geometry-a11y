import { dragStep, pointerX } from '../geometry.js';

const EDITABLE_SELECTOR = 'input, textarea, select, [contenteditable]';

function isEditableTarget(target) {
  return Boolean(target && typeof target.closest === 'function' && target.closest(EDITABLE_SELECTOR));
}

class Events {
  #dragOrigin = null;
  #options = null;
  #threesixty = null;

  #eventHandlers = null;

  constructor(threesixty, options) {
    this.#options = options;
    this.#threesixty = threesixty;

    this.#eventHandlers = {
      container: {
        mousedown: (e) => this.#dragOrigin = pointerX(e),
        touchstart: (e) => this.#dragOrigin = pointerX(e),
        touchend: () => this.#dragOrigin = null,
        keydown: (e) => this._onKeydown(e)
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
        mousemove: (e) => this._onDrag(e, this.#options.dragTolerance),
        touchmove: (e) => this._onDrag(e, this.#options.swipeTolerance)
      }
    };

    this._initEvents();
  }

  _onDrag(e, tolerance) {
    const x = pointerX(e);
    const step = dragStep(this.#dragOrigin, x, tolerance);

    if (step === 0) {
      return;
    }

    this.#threesixty.stop();
    step < 0 ? this.#threesixty.prev() : this.#threesixty.next();
    this.#dragOrigin = x;
  }

  _onKeydown(e) {
    if (isEditableTarget(e.target)) {
      return;
    }

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        this.#threesixty.prev();
        break;
      case 'ArrowRight':
        e.preventDefault();
        this.#threesixty.next();
        break;
      case 'Home':
        e.preventDefault();
        this.#threesixty.goto(0);
        break;
      case 'End':
        e.preventDefault();
        this.#threesixty.goto(-1);
        break;
    }
  }

  destroy() {
    this.#options.swipeTarget.removeEventListener('mousedown', this.#eventHandlers.container.mousedown);
    this.#options.swipeTarget.removeEventListener('touchstart', this.#eventHandlers.container.touchstart);
    this.#options.swipeTarget.removeEventListener('touchend', this.#eventHandlers.container.touchend);
    this.#threesixty.container.removeEventListener('keydown', this.#eventHandlers.container.keydown);

    window.removeEventListener('mouseup', this.#eventHandlers.global.mouseup);
    window.removeEventListener('mousemove', this.#eventHandlers.global.mousemove);
    window.removeEventListener('touchmove', this.#eventHandlers.global.touchmove);

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
      this.#threesixty.container.addEventListener('keydown', this.#eventHandlers.container.keydown);
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
