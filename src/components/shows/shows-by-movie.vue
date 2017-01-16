<template>
  <div class="shows__view shows__view--movies">
    <ul class="ui-list ui-list--movies">
      <li v-for="movie in movies">
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

import Movie from './../Movie';

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

        return computedMovie;
      });
      return [computedMovies[0]];
    },
  },
  components: {
    'kh-movie': Movie,
  },
};
</script>

<style lang="scss">
</style>
