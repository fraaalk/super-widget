<template>
  <div class="movie-info movie-info--long">
    <dl class="ui-definition-list ui-definition-list--inline">
      <template v-if="movie.title">
        <dt>{{ $t('title') }}</dt>
        <dd>{{ movie.title }}</dd>
      </template>
      <template v-if="movie.title_orig && movie.title_orig !== movie.title">
        <dt class="linebreak-before">{{ $t('originalTitle') }}</dt>
        <dd>{{ movie.title_orig }}</dd>
      </template>
      <template v-if="movie.productionCountries">
        <dt class="movie-info__production">{{ $t('production') }}</dt>
        <dd class="movie-info__production">
          <template v-for="country in movie.productionCountries">
            {{ country }},
          </template>
          <template v-if="movie.released">
           {{ getFormattedYear(movie.released) }}
          </template>
        </dd>
      </template>
      <template v-if="movie.startdate">
        <dt class="movie-info__release-date linebreak-before">{{ $('releaseDate') }}</dt>
        <dd class="movie-info__release-date">{{ getFormattedDate(movie.startdate, 'full') }}</dd>
      </template>
      <template v-if="movie.distributor">
        <dt class="movie-info__distributor linebreak-before">{{ $t('distributor') }}</dt>
        <dd class="movie-info__distributor">{{ movie.distributor }}</dd>
      </template>
      <template v-if="movie.directors">
        <dt class="movie-info__director newline-before">{{ $t('director') }}</dt>
        <dd class="movie-info__director">
            <span v-for="name in movie.directors">{{ name }}</span>
        </dd>
      </template>
      <template v-if="movie.actors">
        <dt class="movie-info__actors linebreak-before">{{ $t('actors') }}</dt>
        <dd class="movie-info__actors">
            <span v-for="name in movie.actors">{{ name }}</span>
        </dd>
      </template>
    </dl>

    <ul class="movie-info__scenes" v-if="movie.scenes">
      <li v-for="scene in movie.scenes">
        <img 
          class="ui-image ui-image--responsive ui-image--lazyload"
          v-lazy="scene"
          src="data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox%3D'0 0 4 3'%2F%3E">
      </li>
    </ul>

    <p class="movie-info__description movie-info__paragraph" v-if="movie.description">
     {{ movie.description }}
    </p>

    <p class="movie-info__additional-description movie-info__paragraph" v-if="movie.additional_description">
     {{ movie.additional_description }}
    </p>
  </div>
</template>

<script>
import dateFormatMixin from './../../mixins/date-format';

export default {
  mixins: [
    dateFormatMixin,
  ],
  props: [
    'movieId',
  ],
  computed: {
    movie() {
      return this.$store.state.components[this.movieId];
    },
  },
};
</script>

<style lang="scss">
</style>
