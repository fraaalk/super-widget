<template>
  <article 
    class="movie"
    :data-uid="_uid"
    :data-movie-id="movie.movieId" 
    :data-group-id="movie.groupId">
    <div class="grid">
      <header class="ui-header grid__col-12 grid__cell">
        <span class="ui-title">
          {{ movie.name }}
        </span>
        <span v-for="flag in movie.flags" class="ui-flag">
          {{ flag }}
        </span>
      </header>

      <div class="movie__image grid__col-5 grid__col-xs-3 grid__col-md-2 grid__col--bleed">
        <div class="grid">
          <div class="grid__col-12">
            <div class="ui-aspect ui-aspect-7-10">
              <div class="ui-aspect__inner">
                <template v-if="movie.lazyImage">
                  <img 
                    class="ui-image ui-image--responsive ui-image--lazyload"
                    v-lazy="'https://www.kinoheld.de' + movie.lazyImage"
                    :src= "movie.previewImage"
                    :alt="movie.name">
                </template>
                <template v-else>
                  <kh-svg-icon
                    icon-class="ui-image ui-image--responsive ui-image--placeholder"
                    icon-xlink="#svg-movieroll">
                  </kh-svg-icon>
                </template>
              </div>
            </div>

            <div class="grid__col-12 u-bleed-left u-bleed-right u-bleed-bottom">
              <div class="ui-button-group">
                <!-- movie info toggle -->
                <button 
                  type="button" 
                  class="ui-button ui-button--secondary"
                  :class="{
                    'is-active': showMovieInfo, 
                    'ui-corners-left': movie.hasTrailer,
                    'ui-corners': !movie.hasTrailer
                  }"
                  @click="toggleMovieInfo()">
                  <div class="ui-button__inner">
                    <kh-svg-icon
                      icon-class="ui-button__icon"
                      icon-xlink="#svg-info">
                    </kh-svg-icon>
                  </div>
                </button>
                <!-- /movie info toggle -->

                <!-- movie trailer toggle -->
                <button 
                  type="button" 
                  class="ui-button ui-corners-right ui-button--secondary"
                  :class="{'is-active': showMovieTrailer }"
                  @click="toggleMovieTrailer()"
                  v-if="movie.hasTrailer">
                  <div class="ui-button__inner">
                    <kh-svg-icon
                      icon-class="ui-button__icon"
                      icon-xlink="#svg-play">
                    </kh-svg-icon>
                  </div>
                </button>
                <!-- /movie trailer toggle -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid__col-12 grid__col-sm-9 grid__col-md-10 grid--order-3 grid--order-2-sm">
        <kh-carousel class="carousel--movie"
          :slidesPerPage="{none: 3, xs: 3, sm: 4, md: 5, lg: 7, xlg: 7}"
          :totalSlides="schedule.length"
          :componentId="carouselId">

          <kh-carousel-slide 
            v-for="(day, index) in days"
            :slideIndex="index"
            :componentId="carouselId">
            <div class="ui-button ui-button--secondary u-no-wrap is-inactive" :data-timestamp="day">
              <template v-if="getFormattedDate(now) == getFormattedDate(day)">
                <strong>Heute</strong>
              </template>
              <template v-else>
                {{ getFormattedWeekDay(day) }} {{ getFormattedDate(day) }}
              </template>
            </div>

            <ul class="play-times">
              <li v-for="(show, time) in schedule[index]">
                <!-- only 1 auditorium -->
                <a v-if="show.length"
                  class="ui-button ui-button--cta" 
                  :href="show[0].url"
                  :class="{'is-disabled': now >= show[0].start}"
                  @click.prevent="toggleMovieModal(show)">
                  <span>{{ getFormattedTime(show[0].start) }}</span>
                </a>
                <!-- no show found -->
                <span 
                  v-if="!show.length"
                  class="ui-button ui-button--cta is-disabled">
                  -
                </span>
              </li>
            </ul>
          </kh-carousel-slide>
        </kh-carousel>

        <!-- pre sale button -->
        <button 
          type="button" 
          class="movie__pre-sale ui-button ui-button--cta ui-corners"
          :class="{'is-hidden': hidePreSaleButton }"
          @click="goToFirstShow">
          <div class="ui-button__inner">
            <span class="ui-button__text">
              {{ preSaleButtonHint }}
            </span>
            <kh-svg-icon
              icon-class="ui-button__icon"
              icon-xlink="#svg-keyboard_arrow_right">
            </kh-svg-icon>
          </div>
        </button>
        <!-- /pre sale button -->
      </div>

      <div class="grid__col-7 grid__col-xs-9 grid__col-sm-12 grid__col-md-10 grid--order-2 grid--order-3-sm u-bleed-top">
        <!-- short movie info -->
        <kh-movie-info 
          :movieId="componentId"
          infoType="short">
        </kh-movie-info>
        <!-- /short movie info -->
      </div>

      <div class="grid__col-12 u-bleed-top grid--order-4">
        <!-- long movie info -->
        <kh-movie-info
          :movieId="componentId" 
          infoType="long"
          v-if="showMovieInfo">
        </kh-movie-info>
        <!-- /long movie info -->
        <!-- movie trailer -->
        <kh-movie-trailer
          v-if="showMovieTrailer"
          :movieId="componentId">
        </kh-movie-trailer>
        <!-- /movie trailer -->
      </div>
    </div>

    <kh-modal 
      :showHeader="false"
      :showFooter="false"
      cssClasses="ui-corners modal--auditorium-selection"
      v-if="showMovieModal" 
      @close="showMovieModal = false">
      <div slot="body" class="grid">
        <div class="grid__col-12 grid__cell">
          Bitte wählen Sie einen Saal für „<strong>{{ modal.show.name }}</strong>“ am {{ getFormattedDate(modal.show.start) }} um {{ getFormattedTime(modal.show.start)}}
        </div>
        <div v-for="show in modal.shows" class="grid__col-6">
          <a 
            class="ui-button ui-button--primary ui-corners"
            :href="show.url">
            {{ show.auditorium }}
          </a>
        </div>
      </div>
      <div slot="footer"></div>
    </kh-modal>
  </article>
</template>

<script>
import 'array.prototype.findindex';
import objectAssign from 'object-assign';
import { mapGetters, mapActions } from 'vuex';
import SVGIcon from './../SVGIcon';
import Carousel from './../carousel/carousel';
import CarouselSlide from './../carousel/carousel-slide';
import MovieInfo from './../movie/movie-info';
import MovieTrailer from './../movie/movie-trailer';
import Modal from './../modal/modal';
import EventBus from './../../services/event-bus';
import showsMixin from './../shows/shows-mixin';
import dateFormatMixin from './../../mixins/date-format';

export default {
  mixins: [
    showsMixin,
    dateFormatMixin,
  ],
  props: [
    'movie',
  ],
  data() {
    return {
      showMovieInfo: false,
      showMovieTrailer: false,
      showMovieModal: false,
      dataFetched: false,
      modal: {
        show: {},
        shows: [],
      },
    };
  },
  computed: {
    ...mapGetters([
      'now',
      'days',
      'config',
    ]),

    /**
     * Returns a unique identifier as componentId to store
     * the component state in vuex. When fetching data via
     * vue-ressource the component will get updated with
     * additional infos like scene images, cast etc...
     * @returns {String} - Identifier
     */
    componentId() {
      return `${this._uid}-movie`;
    },

    /**
     * Returns a unique identifier as carouselId to store the
     * current state of carousel in vuex
     * @returns {String} - Identifier
     */
    carouselId() {
      return `${this._uid}-carousel`;
    },

    customMovie() {
      return this.movie.movieId.indexOf('_') === 0;
    },

    providerId() {
      return this.$dataLayer.get('cinema.providerId');
    },

    movieId() {
      return this.customMovie
        ? this.movie.movieId.substr(1)
        : this.movie.movieId;
    },

    /**
     * Returns a reference to the carousel component stored in vuex
     * @returns {Object} - Carousel object
     */
    carousel() {
      return this.$store.state.components[this.carouselId];
    },

    /**
     * Returns the unique playtimes in a timetable for the given movie
     */
    timeTable() {
      const playTimes = this.movie.shows.map(
        show => this.getFormattedTime(show.start)
      );

      // Return a unique array of the playtimes
      return [...new Set(playTimes)];
    },

    /**
     * Returns the first carousel slide index for the movie.
     * @returns {Number} - Slide Index with the first show
     */
    firstShowDayIndex() {
      return this.days.findIndex(day =>
        day > this.movie.firstShow
      ) - 1;
    },

    /**
     * Returns a boolean, wether or not the pre sale button should be shown or not
     * @returns {Boolean} - Indicator to hide pre sale button
     */
    hidePreSaleButton() {
      const carousel = this.carousel;
      let hideButton = false;

      if (!carousel
        || (carousel
          && carousel.currentSlide > this.firstShowDayIndex - carousel.visibleSlides
        )
      ) {
        hideButton = true;
      }

      return hideButton;
    },

    /**
     * Returns the translated title for the pre sale button hint
     * @returns {String} - Translated pre sale button hint
     */
    preSaleButtonHint() {
      return this.$t('preSaleHint', {
        date: this.getFormattedDate(this.movie.firstShow),
      });
    },

    schedule() {
      // fetch the relevant days from the days
      const days = this.days.filter((day, dayIndex) =>
        this.movie.lastShow > day || dayIndex <= 6
      );

      const schedule = [];

      days.forEach((day, dayIndex) => {
        // filter shows for each day
        const showsForCurrentDay = this.getShowsForDay(day, this.movie.shows);
        const dailySchedule = {};

        this.timeTable.forEach((time) => {
          dailySchedule[time] = showsForCurrentDay.filter(
            show => this.getFormattedTime(show.start) === time
          );
        });

        schedule[dayIndex] = dailySchedule;
      });

      return schedule;
    },
  },
  methods: {
    ...mapActions([
      'addMovie',
      'updateMovie',
    ]),

    /**
     * Toggles the visibility of the movie modal and populates it with
     * the currently selected day and showtime. If there only is one show
     * present it redirects to the show url
     */
    toggleMovieModal(show) {
      const baseShow = show[0];

      if (show.length > 1) {
        this.modal = {
          show: baseShow,
          shows: show,
        };
      } else {
        window.location.href = baseShow.url;
      }
    },

    /**
     * Fetches the additional movie data in case it has not been loaded yet
     * and toggles the display of the movie info. When its being displayed,
     * the trailer gets hidden.
     */
    toggleMovieInfo() {
      if (!this.dataFetched) {
        this.fetchData();
      }

      this.showMovieInfo = !this.showMovieInfo;
      this.showMovieTrailer = false;
    },

    /**
     * Fetches the additional movie data in case it has not been loaded yet
     * and toggles the visibility of the movie trailer. When its being displayed,
     * the movie info gets hidden.
     */
    toggleMovieTrailer() {
      if (!this.dataFetched) {
        this.fetchData();
      }

      this.showMovieTrailer = !this.showMovieTrailer;
      this.showMovieInfo = false;
    },

    /**
     * Fetches data via $http and updates the stored vuex component
     * on success
     */
    fetchData() {
      const url = this.customMovie
        ? `https://www.kinoheld.local/ajax/movieData?movieId=${this.movieId}&providerId=${this.providerId}`
        : `https://www.kinoheld.local/ajax/movieData?movieId=${this.movieId}`;

      this.$http.get(url)
        .then((response) => {
          this.dataFetched = true;
          this.updateMovie({
            movieId: this.componentId,
            data: {
              ...objectAssign(this.movie, response.body),
            },
          });
        }, () => {
          // console.log(response, response.body);
        });
    },

    /**
     * Jumps to the slide index with the movies first show
     */
    goToFirstShow() {
      EventBus.$emit(`${this.carouselId}.goTo`, this.firstShowDayIndex);
    },
  },
  components: {
    'kh-modal': Modal,
    'kh-carousel': Carousel,
    'kh-carousel-slide': CarouselSlide,
    'kh-svg-icon': SVGIcon,
    'kh-movie-info': MovieInfo,
    'kh-movie-trailer': MovieTrailer,
  },
  created() {
    this.addMovie({
      movieId: this.componentId,
      data: {
        ...this.movie,
      },
    });
  },
};
</script>

<style lang="scss">
@import "./../../vars";
@import "~breakpoint-sass/stylesheets/breakpoint";
@import "~family.scss/source/src/family";

.movie__pre-sale {
  //@TODO: fix magic number and important
  margin: 2em 36px 0 36px !important;

  @include breakpoint($bp-md-up) { 
    max-width: 50%;
  }
}
</style>
