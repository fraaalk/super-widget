<template>
  <div :class="movieInfoClasses">
    <template v-if="infoType === 'short'">
      <dl class="ui-defintion-list ui-definition-list--inline">
        <template v-if="movie.duration">
          <dt>{{ $t('duration') }}</dt>
          <dd>{{ movie.duration }}</dd>
        </template>
        <template v-if="movie.ageRating">
          <dt>{{ $t('ageRating') }}</dt>
          <dd>{{ movie.ageRating }}</dd>
        </template>
        <template v-if="movie.language">
          <dt>{{ $t('language') }}<template v-if="movie.subtitle"> / {{ $t('subtitle') }}</template></dt>
          <dd>{{ movie.language }} <template v-if="movie.subtitle"> / {{ movie.subtitle }}</template></dd>
        </template>
        <template v-if="movie.genre">
          <dt>{{ $t('genre') }}</dt>
          <dd>{{ movie.genre }}</dd>
        </template>
      </dl>
    </template>
    <template v-if="infoType === 'long'">
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
          <dt class="movie-info__release-date u-linebreak-before">{{ $t('releaseDate') }}</dt>
          <dd class="movie-info__release-date">{{ getFormattedDate(movie.startdate, 'full') }}</dd>
        </template>
        <template v-if="movie.distributor">
          <dt class="movie-info__distributor u-linebreak-before">{{ $t('distributor') }}</dt>
          <dd class="movie-info__distributor">{{ movie.distributor }}</dd>
        </template>
        <template v-if="movie.directors">
          <dt class="movie-info__director u-newline-before">{{ $t('director') }}</dt>
          <dd class="movie-info__director">
              <span v-for="director in movie.directors">{{ director.name }}</span>
          </dd>
        </template>
        <template v-if="movie.actors">
          <dt class="movie-info__actors u-linebreak-before">{{ $t('actors') }}</dt>
          <dd class="movie-info__actors">
              <span v-for="actor in movie.actors"> {{ actor.name }}</span>
          </dd>
        </template>
      </dl>

      <ul class="movie-info__scenes" v-if="movie.scenes">
        <li v-for="scene in movie.scenes">
          <img class="ui-image ui-image--responsive ui-image--lazyload"
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
    </template>
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
    'infoType',
  ],
  computed: {
    movieInfoClasses() {
      return `movie-info movie-info--${this.infoType}`;
    },

    movie() {
      return this.$store.state.movies[this.movieId];
    },
  },
};
</script>

<style lang="scss">
@import "./../../vars";
@import "~breakpoint-sass/stylesheets/breakpoint";
@import "~family.scss/source/src/family";

.movie-info {
  // .movie-info--short
  &--short {
    > div {
      margin-top: 1em;
    }

    // some special styling for the movie header definition list
    @include breakpoint($bp-sm-down) { 
      dt, dd {
        display: block !important;
        padding: 0.5em 0;
      }

      dt:first-of-type {
        padding: 0 0 0.5em 0;
      }

      dd {
        .ui-theme--custom & {
          border-bottom: 1px solid var(--color-ui-delimiter);
        }

        .ui-theme--dark & {
          border-bottom: 1px solid color(var(--color-ui-background) tint(85%));
        }

        .ui-theme--light & {
          border-bottom: 1px solid color(var(--color-ui-background) shade(85%));
        }
      }
    }
  }

  &__scenes {
    margin: 0 0 0 -0.5em;
    padding: 0;
    list-style-type: none;
    display: flex;
    justify-content: space-between;

    img {
      max-width: 320px !important;
      margin-top: 1em;
    }

    img[lazy=error] {
      display: none;
    }

    > li {
      width: 100%;
      margin-left: 0.5em;

      @include at-least(2) {
        width: 50%;
      }

      @include at-least(3) {
        width: 33.33333%;
      }
  }
}

  // description and additional description
  &__paragraph {
    font-size: 14px;
    font-weight: 300;

    @include breakpoint($bp-sm-up) { 
      font-size: 16px;
    }
  }
}
</style>
