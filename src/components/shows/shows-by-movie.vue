<template>
  <div class="shows__view shows__view--movies">
    <ul class="ui-list ui-list--movies">
      <template v-for="showsGroup in showsCluster">
        <li v-for="shows in showsGroup.shows">
          <kh-movie :movie="shows"></kh-movie>
        </li>
      </template>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import objectAssign from 'object-assign';
import orderBy from 'lodash/orderBy';
import map from 'lodash/map';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import showsMixin from './../shows/shows-mixin';
import dateFormatMixin from './../../mixins/date-format';
import Movie from './../movie/movie';

const _ = {
  sortBy,
  orderBy,
  groupBy,
  map,
};

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
        const baseMovie = this.$dataLayer.get('movies')[baseShow.movieId];

        // For each showsGroup generate a new show object
        enrichedShowsGroup[showName] = {};

        // And merge it with the base show, the base movie and additional
        // information which is needed for grouping and sorting
        objectAssign(enrichedShowsGroup[showName], baseMovie, baseShow, {
          shows: sortedShows,
          firstShow: sortedShows[0].start,
          lastShow: sortedShows[sortedShows.length - 1].start,
          showsTotal: sortedShows.length,
          showsToday: this.getShowsForDay(this.getTimestampForDay(), sortedShows).length,
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
        let showsToday = 0;
        let firstShow = null;

        showsForCluster.forEach((shows) => {
          showsTotal += shows.showsTotal;
          showsToday += shows.showsToday;

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
  },
  components: {
    'kh-movie': Movie,
  },
};
</script>

<style lang="scss">
</style>
