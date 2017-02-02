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
    /**
     * Returns the timestamp of the beginning of the given day.
     * If no timestamp is provided, the current time is taken.
     * @params {Number} - Timestamp
     * @returns {Number} - Timestamp of the beginning of the day
     */
    getTimestampForDay(timestamp = Date.now()) {
      const date = new Date(timestamp);
      date.setHours(0, 0, 0, 0);
      return date.getTime();
    },

    /**
     * Returns the correct time zone offset for the given show date
     * which is saved in UTC and pushed as timestamp into the data layer
     * @param {Object} date - Date Object
     * @returns {Number} - The timezone offset
     */
    getTimezoneOffsetForShowDate(date) {
      return date.getTimezoneOffset() < this.standardTimezoneOffset
        ? DataLayer.get('config.timezoneOffsetDST')
        : DataLayer.get('config.timezoneOffset');
    },

    /**
     * Returns the formatted and localized short day of the given timestamp
     * @param {Number} timestamp - Timestamp
     * @returns {String} - Formatted day in utc
     */
    getFormattedShortDate(timestamp) {
      const format = DataLayer.get('config.dateFormats.short');
      const date = new Date(timestamp);
      return formatDate(format, date, this.getTimezoneOffsetForShowDate(date));
    },

    /**
     * Returns the formatted and localized time if the given timestamp
     * @param {Number} timestamp - Timestamp
     * @returns {String} - Formatted time
     */
    getFormattedTime(timestamp) {
      const format = 'hh:mm';
      const date = new Date(timestamp);
      return formatDate(format, date, this.getTimezoneOffsetForShowDate(date));
    },

    /**
     * Returns the formatted and localized time if the given timestamp
     * @param {Number} timestamp - Timestamp
     * @returns {String} - Formatted time
     */
    getFormattedWeekDay(timestamp) {
      const weekDays = DataLayer.get('config.weekDays');
      const date = new Date(timestamp);
      return weekDays[date.getDay()];
    },
  },
};

export default dateMixin;
