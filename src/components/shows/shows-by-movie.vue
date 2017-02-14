<template>
  <div class="shows__view shows__view--movies">
    <ul class="ui-list ui-list--movies">
      <!-- <template v-for="showsGroup in showsCluster"> -->
        <li v-for="shows in showsSorted">
          <kh-movie :movie="shows"></kh-movie>
        </li>
      <!-- </template> -->
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import objectAssign from 'object-assign';
// import orderBy from 'lodash/orderBy';
// import map from 'lodash/map';
// import groupBy from 'lodash/groupBy';
// import sortBy from 'lodash/sortBy';
import showsMixin from './../shows/shows-mixin';
import dateFormatMixin from './../../mixins/date-format';
import Movie from './../movie/movie';

// const _ = {
//   sortBy,
//   orderBy,
//   groupBy,
//   map,
// };

export default {
  mixins: [
    showsMixin,
    dateFormatMixin,
  ],
  computed: {
    ...mapGetters([
      'shows',
    ]),

    /**
     * Returns a computed list of movies, where the shows merged into
     * @returns {Array} - Array of computed, extended movies
     */
    showsGrouped() {
      // Start off by grouping the shows by groupId
      const showsGroup = this.shows.reduce((group, show) => {
        group[show.groupId] = group[show.groupId] || [];
        group[show.groupId].push(show);
        return group;
      }, {});

      // Then loop over the generated object's keys
      const enrichedShowsGroup = {};
      Object.keys(showsGroup).forEach((groupId) => {
        const show = showsGroup[groupId];
        const sortedShows = show.sort((a, b) =>
          a.start - b.start
        );
        const baseShow = sortedShows[0];
        const baseMovie = this.$dataLayer.get('movies')[baseShow.movieId];

        // For each showsGroup generate a new show object
        enrichedShowsGroup[groupId] = {};

        // And merge it with the base show, the base movie and additional
        // information which is needed for grouping and sorting
        objectAssign(enrichedShowsGroup[groupId], baseMovie, baseShow, {
          shows: sortedShows,
          firstShow: sortedShows[0].start,
          lastShow: sortedShows[sortedShows.length - 1].start,
        });

        // Afterwards cleanup unnecessary properties
        delete enrichedShowsGroup[groupId].start;
        delete enrichedShowsGroup[groupId].url;
        delete enrichedShowsGroup[groupId].auditoriumId;
      });

      return enrichedShowsGroup;
    },

    /**
     * Returns the
     */
    showsSorted() {
      const sorting = this.$dataLayer.get('showGroups');
      const sortedShows = [];

      sorting.forEach((key) => {
        sortedShows.push(this.showsGrouped[key]);
      });

      return sortedShows;
    },
  },
  components: {
    'kh-movie': Movie,
  },
};
</script>

<style lang="scss">
</style>
