const showsMixin = {
  methods: {
    /**
     * Returns an object with shows for the given day
     * @param {Number} dayTimestamp - The timestamp of the day to search for
     * @param {Array} shows - The source array of shows to filter
     * @returns {Array} - Filtered array of shows, sorted ascending by start time
     */
    getShowsForDay(day, shows) {
      return shows.filter(show =>
        show.start > day && show.start < day + 86400000
      ).sort((a, b) =>
        a.start - b.start
      );
    },
  },
};

export default showsMixin;
