import _throttle from 'lodash/throttle';
import DataLayer from './../services/data-layer';
import EventBus from './../services/event-bus';

const availableBreakpoints = DataLayer.get('config.breakpoints');
const classNames = {
  uiTouch: 'ui-touch',
  uiMouse: 'ui-mouse',
  uiLandscape: 'ui-landscape',
  uiPortrait: 'ui-portrait',
};
const throttleWait = 300;
const moduleName = 'viewport';

let storedViewport;

/**
 * Returns the current breakpoint size in which the website is viewed right now
 *
 * @returns {String} - current breakpoint name (null, xs, sm, md, lg, xlg)
 */
function getBreakpoint() {
  const currentWidth = document.documentElement.clientWidth;
  let breakpoint = 'none';

  Object.keys(availableBreakpoints).forEach((key) => {
    if (currentWidth > availableBreakpoints[key]) {
      breakpoint = key;
    }
  });

  return breakpoint;
}

/**
 * Returns an object with the current height and width of the viewport
 *
 * @return {Object} - dimension with width and height property
 */
function getDimension() {
  return {
    width: document.documentElement.clientWidth,
    height: document.documentElement.clientHeight,
  };
}

/**
 * Returns current viewport orientation.
 *
 * @returns {String} - landscape or portrait mode
 */
function getOrientation() {
  const width = document.documentElement.clientWidth;
  const height = document.documentElement.clientHeight;

  return width > height
    ? 'landscape'
    : 'portrait';
}

/**
 * Returns the current scroll position of the viewport
 *
 * @returns {Integer} - scroll position
 */
function getScrollTop() {
  return document.documentElement.scrollTop || document.body.scrollTop;
}

/**
 * Returns the viewport object with all of its properties
 *
 * @returns {Object} - current viewport object with all available properties
 */
function getViewport() {
  return {
    scrollTop: getScrollTop(),
    breakpoint: getBreakpoint(),
    dimension: getDimension(),
    bodyHeight: document.body.offsetHeight,
    orientation: getOrientation(),
    hasTouch: document.body.classList.contains(classNames.uiTouch),
    hasMouse: document.body.classList.contains(classNames.uiMouse),
  };
}

/**
 * Gets fired when the mouse is moved. Sets a helper class to the body
 * for other components to handle mouse events (hover etc.) properly.
 * Then removes event listeners to lock the device detection.
 */
function detectMouse() {
  document.body.classList.add(classNames.uiMouse);
  document.body.classList.remove(classNames.uiTouch);

  window.removeEventListener('touchstart', detectTouch);
  window.removeEventListener('mousemove', detectMouse);
}

function broadcastFrameHeight(height) {
  window.parent.postMessage(`if_height=${height}`, '*');
}

/**
 * Gets fired when touch event is initiated. Sets a helper class to the body
 * for other components to handle touch properly.
 * Then removes event listeners to lock the device detection.
 */
function detectTouch() {
  document.body.classList.add(classNames.uiTouch);
  document.body.classList.remove(classNames.uiMouse);

  window.removeEventListener('touchstart', detectTouch);
  window.removeEventListener('mousemove', detectMouse);
}

/**
 * Broadcasts current viewport object over pubSub.
 * Components can subscribe to viewport.breakpoint / viewport.scroll to get
 * notified and adapt to the new viewport (i.e. adjust amount of slides to display
 * for the carousel component, which might be set to 1 for 'xs' and
 * 5 on 'lg').
 * @param {Event} - Browser event
 */
function broadcastViewport(event) {
  const newViewport = getViewport();

  // Broadcast message for breakpoint changes
  if (storedViewport.breakpoint !== newViewport.breakpoint) {
    EventBus.$emit(`${moduleName}.breakpoint`, newViewport);
  }

  // Broadcast frame height if it has changed
  if (storedViewport.bodyHeight !== newViewport.bodyHeight) {
    broadcastFrameHeight(newViewport.bodyHeight);
  }

  // Broadcast message for orientation changes
  if (storedViewport.orientation !== newViewport.orientation) {
    // Reset orientation helper class
    if (newViewport.orientation === 'landscape') {
      document.body.classList.remove(classNames.uiPortrait);
      document.body.classList.add(classNames.uiLandscape);
    } else {
      document.body.classList.remove(classNames.uiLandscape);
      document.body.classList.add(classNames.uiPortrait);
    }

    EventBus.$emit(`${moduleName}.orientation`, newViewport);
  }

  // Broadcast message for scroll changes
  if (event && event.type === 'scroll') {
    EventBus.$emit(`${moduleName}.scroll`, newViewport);
  }

  // Broadcast message for resizes
  if (event && event.type === 'resize') {
    EventBus.$emit(`${moduleName}.resize`, newViewport);
  }

  // Store newViewport to check against in the next iteration
  storedViewport = newViewport;
}

/**
 * Returns either a specific property of the current viewport or
 * the whole object
 *
 * @returns {Property} - Requested property or the whole viewport object.
 */
function get(value) {
  if (value) {
    return storedViewport[value]
      ? storedViewport[value]
      : null;
  }

  return storedViewport;
}

// Store the current viewport
storedViewport = getViewport();

// Add helper class to body with the current viewport orientation
if (getOrientation() === 'landscape') {
  document.body.classList.add(classNames.uiLandscape);
} else {
  document.body.classList.add(classNames.uiPortrait);
}

// Add event listeners
window.addEventListener('mousemove', detectMouse);
window.addEventListener('touchstart', detectTouch);
window.addEventListener('scroll', _throttle(broadcastViewport, throttleWait));
window.addEventListener('resize', _throttle(broadcastViewport, throttleWait));

module.exports = {
  get,
  refresh: broadcastViewport,
};
