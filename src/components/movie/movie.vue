<template>
  <article 
    class="movie"
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
              <button type="button" class="ui-button ui-corners ui-button--secondary"
                @click="fetchMovieData()">
                <div class="ui-button__inner">
                  <kh-svg-icon
                    icon-class="ui-button__icon"
                    icon-xlink="#svg-info">
                  </kh-svg-icon>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="movie__schedule grid__col-12 grid__col-sm-9 grid__col-md-10 grid--order-3 grid--order-2-sm">
        <kh-carousel
          :slidesPerPage="carouselConfig.slidesPerPage"
          :cssClasses="carouselConfig.cssClasses"
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
                  @click.prevent="selectAuditorium(show)">
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
      </div>

      <div class="movie__info grid__col-7 grid__col-xs-9 grid__col-sm-12 grid__col-md-10 grid--order-2 grid--order-3-sm u-bleed-top">
        <div class="movie-info movie-info--short">
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
        </div>
      </div>

      <div class="movie__info grid__col-12 u-bleed-top grid--order-4">
        <kh-movie-info :movieId="componentId"></kh-movie-info>
      </div>

      <!-- <div class="movie-info movie-info--trailer">
      <video class="video-player video-js vjs-default-skin vjs-big-play-centered" data-module="video-player" title="<%= details.title %>" controls preload="auto" poster="">
        <source 
          v-for="trailer in movie.trailers"
          :src="trailer.url" 
          :type="`video/${trailer.format}`" 
          :label="trailer.height" 
          :res="trailer.height">
      </video>
    </div>
  </div> -->
    </div>

    <kh-modal 
      :showHeader="false"
      :showFooter="false"
      cssClasses="ui-corners modal--auditorium-selection"
      v-if="modal.show" 
      @close="modal.show = false">
      <div slot="body" class="grid">
        <div class="grid__col-12 grid__cell" 
          v-html="modal.body">
        </div>
        <div v-for="show in modal.selectedShows" class="grid__col-6">
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
import { mapGetters } from 'vuex';
import SVGIcon from './../SVGIcon';
import Carousel from './../carousel/carousel';
import CarouselSlide from './../carousel/carousel-slide';
import MovieInfo from './../movie/movie-info';
import Modal from './../modal/modal';
import EventBus from './../../services/event-bus';
import showsMixin from './../shows/shows-mixin';
import dateFormatMixin from './../../mixins/date-format';
import DataLayer from './../../services/data-layer';

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
      modal: {
        header: '',
        message: '',
        show: false,
        selectedShows: null,
      },
      carouselConfig: {
        cssClasses: {
          carousel: [
            'carousel--movie',
          ],
        },
        slidesPerPage: {
          none: 3,
          xs: 3,
          sm: 4,
          md: 5,
          lg: 7,
          xlg: 7,
        },
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
    selectAuditorium(show) {
      const baseShow = show[0];

      if (show.length > 1) {
        this.modal = {
          body: `Bitte wählen Sie einen Saal für „<strong>${baseShow.name}</strong>“ am ${this.getFormattedDate(baseShow.start)} um ${this.getFormattedTime(baseShow.start)}`,
          show: true,
          selectedShows: show,
        };
      } else {
        window.location.href = baseShow.url;
      }
    },
    goToFirstShow() {
      EventBus.$emit(`${this.carouselId}.goTo`, this.firstShowDayIndex);
    },
    fetchMovieData() {
      // To prevent fetching data a second time, check if the movie already
      if (this.$store.state.components[this.componentId].title) {
        return;
      }

      const providerId = DataLayer.get('cinema.providerId');
      const movieId = this.movie.movieId.indexOf('_') === 0
        ? this.movie.movieId.substr(1)
        : this.movie.movieId;

      const dataUrl = this.movie.movieId.indexOf('_') === 0
        ? `https://www.kinoheld.local/ajax/movieData?movieId=${movieId}&providerId=${providerId}`
        : `https://www.kinoheld.local/ajax/movieData?movieId=${movieId}`;

      this.$http.get(dataUrl)
        .then((response) => {
          // Success callback
          // Store component mutation in vuex
          this.$store.commit('UPDATE_COMPONENT', {
            componentId: this.componentId,
            data: {
              ...objectAssign(this.movie, response.body),
            },
          });
        }, () => {
          // Error callback
          // @TODO send sentry event
        });
    },
  },
  components: {
    'kh-modal': Modal,
    'kh-carousel': Carousel,
    'kh-carousel-slide': CarouselSlide,
    'kh-svg-icon': SVGIcon,
    'kh-movie-info': MovieInfo,
  },
  created() {
    // Add the component in its current state to vuex
    this.$store.commit('ADD_COMPONENT', {
      componentId: this.componentId,
      data: {
        ...this.movie,
      },
    });
  },
};
</script>

<style lang="scss">
.movie__pre-sale {
  margin: 1em;
}
</style>
