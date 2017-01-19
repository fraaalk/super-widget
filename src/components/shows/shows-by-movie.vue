<template>
  <div class="shows__view shows__view--movies">
    <ul class="ui-list ui-list--movies">
      <li v-for="movie in filteredMovies">
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
import DataLayer from './../../services/data-layer';

import Movie from './../movie/movie';

const _ = {
  groupBy,
  merge,
  map,
  sortBy,
};

export default {
  computed: {
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
    filteredMovies() {
      const filteredMovies = this.movies.filter(movie =>
        movie.shows.length
      );

      return filteredMovies;
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
