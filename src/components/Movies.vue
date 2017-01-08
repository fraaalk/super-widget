<template>
  <div class="shows__view shows__view--movies">
    <ul class="ui-list ui-list--movies">
      <li v-for="movie in movies">
        <kh-movie :movie="movie"></kh-movie>
      </li>
    </ul>
  </div>
</template>

<script>
import groupBy from 'lodash/groupBy';
import merge from 'lodash/merge';
import map from 'lodash/map';
import sortBy from 'lodash/sortBy';

import Movie from './Movie';

const _ = {
  groupBy,
  merge,
  map,
  sortBy,
};

export default {
  computed: {
    movies() {
      const computedMovies = _.map(_.groupBy(window.dataLayer[0].shows, 'name'), (show) => {
        // make sure shows per move are sorted by start date (first show time now sits in the
        // computedMovie object :) )
        const sortedShows = _.sortBy(show, 'start');
        const baseShow = sortedShows[0];
        const baseMovie = window.dataLayer[0].movies[baseShow.movieId];
        const computedMovie = {};

        _.merge(computedMovie, baseMovie, baseShow);
        computedMovie.shows = sortedShows;

       // console.log( computedMovie )
        return computedMovie;
      });

      return computedMovies;
    },
  },
  components: {
    'kh-movie': Movie,
  },
};
</script>

<style lang="scss">
</style>
