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
              <template v-if="today == day.timestamp">
                <strong>Heute</strong>
              </template>
              <template v-else>
                {{ day.timestamp | localizeWeekDay }} {{ day.timestamp | localizeDate }}
              </template>
            </div>

          </kh-carousel-slide>
        </kh-carousel>
      </div>
    </div>

    <transition mode="out-in" name="transition-fade">
      <template 
        v-for="(day, dayIndex) in days"
        v-if="dayIndex === selectedDay">
        <ul class="ui-list ui-list--shows">
          <li class="grid grid--align-center"
            v-if="processedShows[dayIndex].hasShows"
            v-for="(show, showName) in processedShows[dayIndex].shows">
            <div class="grid__col-12 grid__col-md-4 grid__cell">
              {{ showName }}
            </div>
            <ul class="play-times grid__col-12 grid__col-md-8">
              <li v-for="(showTime, showTimeIndex) in show">
                <a 
                  class="ui-button ui-button--cta" 
                  :href="showTime.url"
                  v-if="now < showTime.start">
                  <span>{{ showTime.start | localizeTime }}</span>
                  <span class="ui-flag" v-for="flag in showTime.flags">
                    {{ flag }}
                  </span>
                </a>
                <div 
                  class="ui-button ui-button--cta is-disabled"
                  v-if="now > showTime.start">
                  <span>{{ showTime.start | localizeTime }}</span>
                  <span class="ui-flag ui-flag--muted" v-for="(flag, flagName) in showTime.flags">
                    {{ flag }}
                  </span>
                </div>
              </li>
            </ul>
          </li>
          <li v-if="!processedShows[dayIndex].hasShows">
            <p class="u-text-center">
              No data available for the selected date.
            </p>
          </li>
        </ul>
      </template>  
    </transition>
  </div>
</template>

<script>
import groupBy from 'lodash/groupBy';
import formatDate from 'date-format';

import { mapGetters } from 'vuex';
import Carousel from './../carousel/carousel';
import CarouselSlide from './../carousel/carousel-slide';
import DataLayer from './../../services/data-layer';

const _ = {
  groupBy,
};

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
    // get today and days array from vuex store
    ...mapGetters([
      'now',
      'today',
      'days',
      'shows',
    ]),
    carouselId() {
      return `${this._uid}-carousel`;
    },

    /**
     * Returns
     */
    processedShows() {
      const days = [];
      const shows = this.shows;

      this.days.forEach((day, dayIndex) => {
        const showsForDay = this.getShowsForDay(day.timestamp, shows);
        days[dayIndex] = {
          shows: _.groupBy(showsForDay, 'name'),
          hasShows: showsForDay.length,
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
    getShowsForDay(dayTimestamp, shows) {
      const dateFormat = DataLayer.get('config.dateFormats.short');
      const timezoneOffset = DataLayer.get('config.timezoneOffset');
      const currentDay = formatDate(dateFormat, new Date(dayTimestamp), timezoneOffset);

      return shows.filter(show =>
        currentDay === formatDate(dateFormat, new Date(show.start), timezoneOffset)
      ).sort((a, b) =>
        a.start - b.start
      );
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
