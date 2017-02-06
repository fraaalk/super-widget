<template>
  <div>
    Nach einer bestimment Vorstellung suchen
    <span class="ui-flag" v-for="flag in flagList">
      {{ flag }}
    </span>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  ...mapGetters([
    'movies',
    'shows',
  ]),
  computed: {
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
      const flagList = this.shows.map(show =>
        show.flags
      ).reduce((a, b) => a.concat(b));

      return [...new Set(flagList)];
    },
    created() {
      console.log(this.shows);
    },
  },
};
</script>