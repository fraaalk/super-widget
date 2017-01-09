/* eslint-disable */

import 'data-layer-helper/dist/data-layer-helper';
import merge from 'lodash/merge';

const dataLayer = window.dataLayer;
const helper = new window.DataLayerHelper(dataLayer);
const _ = {
  merge,
};

function get(property) {
  return helper.get(property);
}

/**
 * Pushes a message into the datalayer
 * @param message       - Property to push into the datalayer
 *
 * @returns {Boolean}   - Indicator if the push was successful or not
 */
function set(property) {
  if (typeof (property) === 'object') {
    dataLayer.push(property);
    return true;
  }
  return false;
}

function pushEvent(name, message) {
  _.merge(message, {
    event: name,
  });

  return set(message);
}

module.exports = {
  set,
  get,
  pushEvent,
};
