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
    getFormattedDate(timestamp, displayFormat = 'short') {
      const format = DataLayer.get(`config.dateFormats.${displayFormat}`);
      const date = new Date(timestamp);
      return this.formatDate(format, date, this.getTimezoneOffsetForShowDate(date));
    },

    /**
     * Returns the formatted and localized time if the given timestamp
     * @param {Number} timestamp - Timestamp
     * @returns {String} - Formatted time
     */
    getFormattedTime(timestamp) {
      const format = 'hh:mm';
      const date = new Date(timestamp);
      return this.formatDate(format, date, this.getTimezoneOffsetForShowDate(date));
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

    getFormattedYear(timestamp) {
      const format = 'yyyy';
      const date = new Date(timestamp);
      return this.formatDate(format, date, this.getTimezoneOffsetForShowDate(date));
    },

    // date-format copy
    padWithZeros(vNumber, width) {
      let numAsString = vNumber.toString();
      while (numAsString.length < width) {
        numAsString = `0${numAsString}`;
      }
      return numAsString;
    },

    addZero(vNumber) {
      return this.padWithZeros(vNumber, 2);
    },

    /**
     * Formats the TimeOffset
     * Thanks to http://www.svendtofte.com/code/date_format/
     * @private
     */
    offset(timezoneOffset) {
      // Difference to Greenwich time (GMT) in hours
      const os = Math.abs(timezoneOffset);
      let h = String(Math.floor(os / 60));
      let m = String(os % 60);
      if (h.length === 1) {
        h = `0${h}`;
      }
      if (m.length === 1) {
        m = `0${m}`;
      }
      return timezoneOffset < 0 ? `+${h}${m}` : `-${h}${m}`;
    },

    formatDate(format, date, timezoneOffset) {
      if (typeof format !== 'string') {
        timezoneOffset = date;
        date = format;
        format = module.exports.ISO8601_FORMAT;
      }
      if (!date) {
        date = new Date();
      }
      // make the date independent of the system timezone by working with UTC
      if (timezoneOffset === undefined) {
        timezoneOffset = date.getTimezoneOffset();
      }

      date.setUTCMinutes(date.getUTCMinutes() - timezoneOffset);
      const vDay = this.addZero(date.getUTCDate());
      const vMonth = this.addZero(date.getUTCMonth() + 1);
      const vYearLong = this.addZero(date.getUTCFullYear());
      const vYearShort = this.addZero(date.getUTCFullYear().toString().substring(2, 4));
      const vYear = (format.indexOf('yyyy') > -1 ? vYearLong : vYearShort);
      const vHour = this.addZero(date.getUTCHours());
      const vMinute = this.addZero(date.getUTCMinutes());
      const vSecond = this.addZero(date.getUTCSeconds());
      const vMillisecond = this.padWithZeros(date.getUTCMilliseconds(), 3);
      const vTimeZone = this.offset(timezoneOffset);
      date.setUTCMinutes(date.getUTCMinutes() + timezoneOffset);
      const formatted = format
        .replace(/dd/g, vDay)
        .replace(/MM/g, vMonth)
        .replace(/y{1,4}/g, vYear)
        .replace(/hh/g, vHour)
        .replace(/mm/g, vMinute)
        .replace(/ss/g, vSecond)
        .replace(/SSS/g, vMillisecond)
        .replace(/O/g, vTimeZone);
      return formatted;
    },
  },
};

export default dateMixin;
