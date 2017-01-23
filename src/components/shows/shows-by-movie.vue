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
import groupBy from 'lodash/groupBy';
import merge from 'lodash/merge';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';
// import flattenDeep from 'lodash/flattenDeep';
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
    /**
     * Returns a computed list of movies, where the shows merged into
     * @returns {Array} - Array of computed, extended movies
     */
    movies() {
      const computedMovies = _.map(_.groupBy(DataLayer.get('shows'), 'name'), (show) => {
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
@import "../../../node_modules/family.scss/source/src/family";
// .schedule
// element class containing .schedule-day and .schedule-times styling
.schedule {

    // .schedule-times
    // list of showtimes for a movie in a horizontal or vertical view
    &__times {
        display: flex;
        align-items: stretch;
        margin: 0;
        list-style-type: none;

        // .shows__view--movies .schedule-times
        // vertical view
        .shows__view--movies & {
            flex-direction: column;
            padding: 0;
        }

        // .shows__view--days .schedule-times
        // horizontal view
        .shows__view--days & { 
            flex-direction: row;
            flex-wrap: wrap;
        }

        > li {
            flex-grow: 1;
            text-align: center;
            
        }

        > li {
            .shows__view--days & {
                width: 16.666667%;
            }

            @include at-least(5) {
                .shows__view--days & {
                    margin-top: 1px;
                }
            }

            @include every(6) { 
                .shows__view--days & {
                    margin-left: 0;
                }
            }

            .shows__view--movies & { 
                margin-top: 1px;
                width: 100%;
            }
        }

        > li + li {
            .shows__view--days & {
                margin-left: 1px;
            }
        }
    }
}
</style>
