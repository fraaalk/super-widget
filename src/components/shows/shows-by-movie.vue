<template>
  <div class="shows__view shows__view--movies">
    <input 
      placeholder="... nach einem Film suchen"
      type="text" 
      v-model="filter">
    <label>
    <input type="checkbox"
      v-model="reverse">
      reverse list?
    </label>
    <ul class="ui-list ui-list--movies">
      <li 
        v-for="movie in sortedMovies"
        v-if="matchesFilter(movie)">
        <kh-movie 
          :movie="movie">
        </kh-movie>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import groupBy from 'lodash/groupBy';
import merge from 'lodash/merge';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
import DataLayer from './../../services/data-layer';

import Movie from './../movie/movie';

const _ = {
  groupBy,
  merge,
  map,
  sortBy,
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
    movies() {
      const shows = this.shows;
      const computedMovies = _.map(_.groupBy(shows, 'name'), (show) => {
        // make sure shows per movie are sorted by start date (first show time now sits in the
        // computedMovie object :) )
        const sortedShows = _.sortBy(show, 'start');
        const baseShow = sortedShows[0];
        const baseMovie = DataLayer.get('movies')[baseShow.movieId];
        const computedMovie = {};

        _.merge(computedMovie, baseMovie, baseShow);
        computedMovie.shows = sortedShows;
        computedMovie.firstShow = sortedShows[0].start;
        computedMovie.lastShow = sortedShows[sortedShows.length - 1].start;

        return computedMovie;
      });
      return computedMovies;
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
     * Returns the movie object if it fullfills the filter criterias
     * @param {Object} movie - Object of computed movie
     * @returns {Boolean} - Indicator wether to show or hide current movie
     */
    matchesFilter(movie) {
      let matchesFilter = false;

      if (movie.name.toLowerCase().indexOf(this.filter) > -1) {
        matchesFilter = true;
      }
      return matchesFilter;
    },
  },
  components: {
    'kh-movie': Movie,
  },
};
</script>

<style lang="scss">
</style>
