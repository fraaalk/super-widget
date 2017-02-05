<template>
  <div class="movie-trailer">
    <video-player 
      :options="options">
    </video-player>
  </div>
</template>

<script>
export default {
  props: [
    'movieId',
  ],
  computed: {
    options() {
      const options = {
        techOrder: [
          'youtube',
        ],
        ytControls: true,
        controls: false,
        autoplay: true,
        defaultSrcReId: 'low',
      };

      if (this.trailers.length > 1) {
        // options.sources = this.trailers.map(trailer => {
        //   return {
        //     type: trailer.format,
        //     src: trailer.url,
        //   };
        // });
      } else if (this.trailers && this.trailers.length === 1) {
        options.source = {
          type: `video/${this.trailers[0].format}`,
          src: this.trailers[0].url,
        };
      }

      console.log(options);

      return options;
    },
    movie() {
      return this.$store.state.components[this.movieId];
    },
    trailers() {
      return this.movie.trailers
        ? this.movie.trailers
        : [];
    },
  },
};
</script>

<style lang="scss">
@import "./../../vars";
@import "~breakpoint-sass/stylesheets/breakpoint";
@import "~family.scss/source/src/family";

.movie-trailer {
  width: 100%;
  position: relative;
  padding-bottom: 50%;

  .video-player {
    width: 100%;
    position: absolute;
    height: 100%;
  }
}
</style>
