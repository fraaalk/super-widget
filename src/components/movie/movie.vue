<template>
  <article 
    :id="movie.movieId" 
    class="grid">
    <header class="ui-header grid__col-12 grid__cell">
      <span class="ui-title">
        {{ movie.name }}
      </span>
      <span v-for="flag in movie.flags" class="ui-flag">
        {{ flag }}
      </span>
    </header>

    <div class="grid__col-5 grid__col-xs-3 grid__col-md-2 grid__col--bleed">
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
        </div>
      </div>
    </div>

    <div class="grid__col-12 grid__col-sm-9 grid__col-md-10">
      <kh-carousel
        :slidesPerPage="carouselConfig.slidesPerPage"
        :cssClasses="carouselConfig.cssClasses"
        :totalSlides="schedule.length"
        :componentId="carouselId">

        <kh-carousel-slide 
          v-for="(day, index) in days"
          :slideIndex="index"
          :componentId="carouselId">
          <div class="ui-button ui-button--secondary u-no-wrap is-inactive">
            <template v-if="getFormattedShortDate(now) == getFormattedShortDate(day)">
              <strong>Heute</strong>
            </template>
            <template v-else>
              {{ getFormattedWeekDay(day) }} {{ getFormattedShortDate(day) }}
            </template>
          </div>

          <ul class="play-times">
            <li v-for="(show, time) in schedule[index]">
              <a v-if="show.length"
                class="ui-button ui-button--cta" 
                :href="show[0].url"
                :class="{'is-disabled': now >= show[0].start}">
                <span>{{ getFormattedTime(show[0].start) }}</span>
              </a>
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


    <div class="grid__col-7 grid__col-sm-9 grid__col-md-10">
      <div class="movie-info movie-info--short">
        <dl class="ui-defintion-list ui-definition-list--inline">
            <dt v-if="movie.duration">{{ $t('duration') }}</dt>
            <dd v-if="movie.duration">{{ movie.duration }}</dd>
            <dt v-if="movie.ageRating">{{ $t('ageRating') }}</dt>
            <dd v-if="movie.ageRating">{{ movie.ageRating }}</dd>
            <dt v-if="movie.language">{{ $t('language') }}<template v-if="movie.subtitle"> / {{ $t('subtitle') }}</template></dt>
            <dd v-if="movie.language">{{ movie.language }} <template v-if="movie.subtitle"> / {{ movie.subtitle }}</template></dd>
            <dt v-if="movie.genre">{{ $t('genre') }}</dt>
            <dd>{{ movie.genre }}</dd>
        </dl>
      </div>
    </div>
  </article>
</template>

<script>
import 'array.prototype.findindex';
import { mapGetters } from 'vuex';
import SVGIcon from './../SVGIcon';
import Carousel from './../carousel/carousel';
import CarouselSlide from './../carousel/carousel-slide';
import EventBus from './../../services/event-bus';
import dateFormatMixin from './../../mixins/date-format';

export default {
  mixins: [
    dateFormatMixin,
  ],
  props: [
    'movie',
  ],
  data() {
    return {
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
     * Returns a unique identifier as carouselId to store the
     * current state of carousel in vuex
     */
    carouselId() {
      return `carousel-m-${this._uid}`;
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
     */
    firstShowDayIndex() {
      const firstShow = new Date(this.movie.firstShow);

      firstShow.setHours(0, 0, 0, 0);

      return this.days.findIndex(day =>
        day === firstShow.getTime()
      );
    },

    /**
     * Returns a reference to the carousel component stored in vuex
     * @returns {Object} - Carousel object
     */
    carousel() {
      return this.$store.state.components[this.carouselId];
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
        date: this.getFormattedShortDate(this.movie.firstShow),
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
    goToFirstShow() {
      EventBus.$emit(`${this.carouselId}.goTo`, this.firstShowDayIndex);
    },

    /**
     * Returns an object with shows for the given day
     * @param {Number} dayTimestamp - The timestamp of the day to search for
     * @param {Array} shows - The source array of shows to filter
     * @returns {Array} - Filtered array of shows, sorted ascending by start time
     */
    getShowsForDay(day, shows) {
      return shows.filter(show =>
        show.start > day && show.start < day + 86400000
      ).sort((a, b) =>
        a.start - b.start
      );
    },
  },
  components: {
    'kh-carousel': Carousel,
    'kh-carousel-slide': CarouselSlide,
    'kh-svg-icon': SVGIcon,
  },
};
</script>

<style lang="scss">
.movie__pre-sale {
  margin: 1em;
}
</style>
