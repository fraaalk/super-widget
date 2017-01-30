<template>
  <div class="shows__view shows__view--movies">
    <!-- <input 
      placeholder="... nach einem Film suchen"
      type="text" 
      v-model="filter">
    <label>
    <input type="checkbox"
      v-model="reverse">
      reverse list?
    </label> -->
    <ul class="ui-list ui-list--movies">
      <template v-for="showsGroup in showsCluster">
        <li v-for="shows in showsGroup.shows" style="overflow:hidden;">
          <kh-movie :movie="shows"></kh-movie>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
// import formatDate from 'date-format';
import objectAssign from 'object-assign';
import orderBy from 'lodash/orderBy';
import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import DataLayer from './../../services/data-layer';

import Movie from './../movie/movie';

const _ = {
  sortBy,
  orderBy,
  groupBy,
  map,
};

export default {
  data() {
    return {
      filter: '',
      reverse: false,
    };
  },
  computed: {
    ...mapGetters([
      'shows',
    ]),

    /**
     * Returns a computed list of movies, where the shows merged into
     * @returns {Array} - Array of computed, extended movies
     */
    showsCluster() {
      // Start off by grouping the shows by show name
      const showsGroup = this.shows.reduce((group, show) => {
        group[show.name] = group[show.name] || [];
        group[show.name].push(show);
        return group;
      }, {});

      // Then loop over the generated object's keys
      const enrichedShowsGroup = {};
      Object.keys(showsGroup).forEach((showName) => {
        const show = showsGroup[showName];
        const sortedShows = show.sort((a, b) =>
          a.start - b.start
        );
        const baseShow = sortedShows[0];
        const baseMovie = DataLayer.get('movies')[baseShow.movieId];

        // For each showsGroup generate a new show object
        enrichedShowsGroup[showName] = {};

        // And merge it with the base show, the base movie and additional
        // information which is needed for grouping and sorting
        objectAssign(enrichedShowsGroup[showName], baseMovie, baseShow, {
          shows: sortedShows,
          firstShow: sortedShows[0].start,
          lastShow: sortedShows[sortedShows.length - 1].start,
          showsTotal: sortedShows.length,
        });

        // Afterwards cleanup unnecessary properties
        delete enrichedShowsGroup[showName].start;
        delete enrichedShowsGroup[showName].url;
        delete enrichedShowsGroup[showName].auditoriumId;
      });

      // Now group the enriched shows groups by groupId to
      // build a showsCluster
      const showsCluster = _.groupBy(enrichedShowsGroup, 'groupId');

      // And then loop over the cluster and enrich it with the total shows
      // for the cluster and more important, the shows today which
      // is sort criteria number 1 for displaying the cluster
      const enrichedShowsCluster = _.map(showsCluster, (showsForCluster) => {
        let showsTotal = 0;
        const showsToday = this.getShowsForDay(this.now, showsForCluster);
        let firstShow = null;

        showsForCluster.forEach((shows) => {
          showsTotal += shows.showsTotal;

          if (!firstShow || shows.firstShow < firstShow) {
            firstShow = shows.firstShow;
          }
        });

        return {
          showsToday,
          showsTotal,
          firstShow,
          shows: showsForCluster,
        };
      });

      // Return the sorted cluster by showsToday, firstShow and showsTotal
      return _.orderBy(enrichedShowsCluster, ['showsToday', 'firstShow', 'showsTotal'], ['desc', 'asc', 'desc']);
    },

    /**
     * Returns an array of unique movie/show names
     * @returns {Array} - Array of movies/show names
     */
    movieList() {
      const movieList = this.movies.map(movie =>
        movie.name
      );
      return [...new Set(movieList)];
    },

    /**
     * Returns an array of unique flags
     * @returns {Array} - Array of flags
     */
    flagList() {
      // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Flatten_an_array_of_arrays
      const flagList = this.movies.map(movie =>
        movie.flags
      ).reduce((a, b) => a.concat(b));

      return [...new Set(flagList)];
    },

    /**
     * Returns the sorted list of the movies to be displayed
     * after applying sorting
     @ returns {Array} - Array of sorted movies
     */
    sortedMovies() {
      const sortedMovies = _.sortBy(this.movies, 'name');

      return !this.reverse
        ? sortedMovies
        : sortedMovies.reverse();
    },
  },
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
  components: {
    'kh-movie': Movie,
  },
};
</script>

<style lang="scss">
</style>
