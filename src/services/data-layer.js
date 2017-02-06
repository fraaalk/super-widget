import 'data-layer-helper/dist/data-layer-helper';
import objectAssign from 'object-assign';

const DataLayer = {
  install(Vue, options) {
    const dataLayer = options.dataLayer
      ? options.dataLayer
      : window.dataLayer;
    const helper = new window.DataLayerHelper(dataLayer);

    // Extend Vue
    Vue.prototype.$dataLayer = {
      /**
       * Returns a property from the data layer
       * @param {String} - property
       */
      get(property) {
        return helper.get(property);
      },

      /**
       * Pushes a message into the datalayer
       * @param message       - Property to push into the datalayer
       * @returns {Boolean}   - Indicator if the push was successful or not
       */
      set(property) {
        if (typeof (property) === 'object') {
          dataLayer.push(property);
        }
      },

      pushEvent(name, message) {
        objectAssign(message, {
          event: name,
        });

        return this.$dataLayer.set(message);
      },
    };
  },
};

export default DataLayer;
