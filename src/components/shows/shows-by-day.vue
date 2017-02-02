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
              <template v-if="getFormattedShortDate(now) == getFormattedShortDate(day)">
                <strong>Heute</strong>
              </template>
              <template v-else>
                {{ getFormattedWeekDay(day) }} {{ getFormattedShortDate(day) }}
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
            v-if="showsList[dayIndex].hasShows"
            v-for="(show, showName) in showsList[dayIndex].shows">
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
                  <span>{{ getFormattedTime(showTime.start) }}</span>
                </a>
                <div 
                  class="ui-button ui-button--cta is-disabled"
                  v-if="now > showTime.start">
                  <span>{{ getFormattedTime(showTime.start) }}</span>
                </div>
              </li>
            </ul>
          </li>
          <li v-if="!showsList[dayIndex].hasShows">
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
import showsMixin from './../shows/shows-mixin';
import dateFormatMixin from './../../mixins/date-format';
import Carousel from './../carousel/carousel';
import CarouselSlide from './../carousel/carousel-slide';

export default {
  mixins: [
    showsMixin,
    dateFormatMixin,
  ],
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
    showsList() {
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
