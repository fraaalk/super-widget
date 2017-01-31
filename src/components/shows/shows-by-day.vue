<template>
  <div class="shows__view shows__view--days">
    <div class="grid grid--justify-end">
    
      <div class="grid__col-12 grid__col-lg-8">
        <kh-carousel
          :slidesPerPage="carouselConfig.slidesPerPage"
          :cssClasses="carouselConfig.cssClasses"
          :totalSlides="days.length"
          :componentId="carouselId">

          <kh-carousel-slide 
            v-for="(day, index) in days"
            :slideIndex="index"
            :componentId="carouselId">

            <div 
              class="ui-button ui-button--secondary u-no-wrap"
              :class="{ 'is-active': index === selectedDay, 'is-inactive': index != selectedDay }"
              @click="goToDay(index)">
              <template v-if="getFormattedDay(now) == getFormattedDay(day)">
                <strong>Heute</strong>
              </template>
              <template v-else>
                {{ day | localizeWeekDay }} {{ day | localizeDate }}
              </template>
            </div>

          </kh-carousel-slide>
        </kh-carousel>
      </div>
    </div>

    <transition mode="out-in" name="custom-transition-classes"
          enter-active-class="animated fadeIn"
          leave-active-class="animated fadeOut">
      <template 
        v-for="(day, dayIndex) in days"
        v-if="dayIndex === selectedDay">
        <ul class="ui-list ui-list--shows">
          <li class="grid grid--align-center"
            v-if="processedShows[dayIndex].hasShows"
            v-for="(show, showName) in processedShows[dayIndex].shows">
            <div class="grid__col-12 grid__col-md-4 grid__cell">
              {{ showName }}
              <span class="ui-flag" v-for="flag in show[0].flags">
                {{ flag }}
              </span>
            </div>
            <ul class="play-times grid__col-12 grid__col-md-8">
              <li v-for="(showTime, showTimeIndex) in show">
                <a 
                  class="ui-button ui-button--cta" 
                  :href="showTime.url"
                  v-if="now < showTime.start">
                  <span>{{ showTime.start | localizeTime }}</span>
                </a>
                <div 
                  class="ui-button ui-button--cta is-disabled"
                  v-if="now > showTime.start">
                  <span>{{ showTime.start | localizeTime }}</span>
                </div>
              </li>
            </ul>
          </li>
          <li v-if="!processedShows[dayIndex].hasShows">
            <p class="u-text-center">
              {{ $t('noDataForTheSelectedDay') }}
            </p>
          </li>
        </ul>
      </template>  
    </transition>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import formatDate from 'date-format';
import Carousel from './../carousel/carousel';
import CarouselSlide from './../carousel/carousel-slide';

export default {
  data() {
    return {
      selectedDay: 0,
      carouselConfig: {
        slidesPerPage: {
          none: 3,
          xs: 4,
          sm: 5,
          md: 6,
          lg: 6,
          xlg: 6,
        },
      },
    };
  },
  computed: {
    ...mapGetters([
      'now',
      'days',
      'shows',
      'config',
    ]),

    /**
     * Returns a unique identifier as carouselId to store the
     * current state of carousel in vuex
     */
    carouselId() {
      return `${this._uid}-carousel`;
    },

    /**
     * Returns a copy of the days array which is enriched
     * with the shows per day grouped by show name
     * @returns {Array} - Array of days
     */
    processedShows() {
      const days = [];
      const shows = this.shows;

      this.days.forEach((day, dayIndex) => {
        const showsForDay = this.getShowsForDay(day, shows);
        days[dayIndex] = {
          hasShows: showsForDay.length,

          // Group showsForDay by show name
          shows: showsForDay.reduce((group, show) => {
            group[show.name] = group[show.name] || [];
            group[show.name].push(show);
            return group;
          }, {}),
        };
      });

      return days;
    },
  },
  methods: {
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

    /**
     * Returns the formatted short day of the given timestamp
     * @returns {String} - Formatted day in utc
     */
    getFormattedDay(timestamp) {
      const format = this.config.dateFormats.short;
      const offset = this.config.timezoneOffset;

      return formatDate(format, new Date(timestamp), offset);
    },

    /**
     * Displays the given day with its shows
     * @param {Number} index - The day index
     */
    goToDay(index) {
      this.selectedDay = index;
    },
  },
  components: {
    'kh-carousel': Carousel,
    'kh-carousel-slide': CarouselSlide,
  },
};
</script>

<style lang="scss">
</style>
