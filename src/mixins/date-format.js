import formatDate from 'date-format';
import DataLayer from './../services/data-layer';

/* mixins around the date format library to return the correct formatted dates from a timestamp
*/
const dateMixin = {
  data() {
    return {
      standardTimezoneOffset() {
        const today = new Date();
        const january = new Date(today.getFullYear(), 0, 1);
        const july = new Date(today.getFullYear(), 6, 1);
        return Math.max(january.getTimezoneOffset(), july.getTimezoneOffset());
      },
    };
  },
  methods: {
    /* Returns the correct time zone offset for the given show date
     * which is saved in UTC and pushed as timestamp into the data layer
     * @param {Object} - Date Object
     * @returns {Number} - The timezone offset
     */
    getTimezoneOffsetForShowDate(date) {
      return date.getTimezoneOffset() < this.standardTimezoneOffset
        ? DataLayer.get('config.timezoneOffsetDST')
        : DataLayer.get('config.timezoneOffset');
    },

    /**
     * Returns the formatted short day of the given timestamp
     * @returns {String} - Formatted day in utc
     */
    getFormattedShortDate(timestamp) {
      const format = DataLayer.get('config.dateFormats.short');
      const date = new Date(timestamp);
      return formatDate(format, date, this.getTimezoneOffsetForShowDate(date));
    },

    getFormattedTime(timestamp) {
      const format = 'hh:mm';
      const date = new Date(timestamp);
      return formatDate(format, date, this.getTimezoneOffsetForShowDate(date));
    },

    getFormattedWeekDay(timestamp) {
      const weekDays = DataLayer.get('config.weekDays');
      const date = new Date(timestamp);
      return weekDays[date.getDay()];
    },
  },
};

export default dateMixin;
