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
                  :data-src="'https://www.kinoheld.de' + movie.lazyImage"
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
          v-for="(day, index) in schedule"
          :slideIndex="index"
          :componentId="carouselId">
          <div class="ui-button ui-button--secondary u-no-wrap is-inactive">
            <template v-if="today == day.timestamp">
              <strong>Heute</strong>
            </template>
            <template v-else>
              {{ day.timestamp | localizeWeekDay }} {{ day.timestamp | localizeDate }}
            </template>
          </div>

          <ul class="play-times">
            <li v-for="(show, time) in day.shows">
              <a v-if="show.length"
                class="ui-button ui-button--cta" 
                :href="show[0].url"
                :class="{'is-disabled': now >= show[0].start}">
                <span>{{ time }}</span>
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
            <span>{{ movie.firstShow | localizeWeekDay }} {{ movie.firstShow | localizeDate }}</span>
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
            <dt v-if="movie.duration">
              Duration
            </dt>
            <dd v-if="movie.duration">
              {{ movie.duration }}
            </dd>
            <dt v-if="movie.ageRating">
              AgeRating
            </dt>
            <dd v-if="movie.ageRating">
              {{ movie.ageRating }}
            </dd>
            <dt v-if="movie.language">
              Language <template v-if="movie.subtitle">/ Subtitle </template>
            </dt>
            <dd v-if="movie.language">
              {{ movie.language }} <template v-if="movie.subtitle"> / {{ movie.subtitle }}</template>
            </dd>
            <dt v-if="movie.genre">
              Genre
            </dt>
            <dd>
              {{ movie.genre }}
            </dd>
        </dl>
      </div>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';
import formatDate from 'date-format';
import SVGIcon from './../SVGIcon';
import Carousel from './../carousel/carousel';
import CarouselSlide from './../carousel/carousel-slide';
import EventBus from './../../services/event-bus';

export default {
  props: ['movie'],
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
      'today',
      'days',
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
        show => `${formatDate('hh:mm', new Date(show.start))}`
      );

      // Return a unique array of the playtimes
      // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Set
      return [...new Set(playTimes)];
    },

    /**
     * Returns the first carousel slide index for the movie.
     */
    firstShowDayIndex() {
      const firstShow = new Date(this.movie.firstShow);

      firstShow.setHours(0, 0, 0, 0);

      // @TODO check for polyfill (babel)
      // https://developer.mozilla.org/de/docs/Web/JavaScript/Reference/Global_Objects/Array/findIndex
      return this.days.findIndex(day =>
        day.timestamp === firstShow.getTime()
      );
    },

    scheduleCarousel() {
      return this.$store.state.components[this.carouselId];
    },

    hidePreSaleButton() {
      const carousel = this.scheduleCarousel;
      let hideButton = false;

      if (!carousel) {
        hideButton = true;
      } else if (carousel.currentSlide > this.firstShowDayIndex - carousel.visibleSlides) {
        hideButton = true;
      }

      return hideButton;
    },

    schedule() {
      // fetch the relevant days from the days
      const days = this.days.filter((day, dayIndex) =>
        this.movie.lastShow > day.timestamp || dayIndex <= 6
      );

      return days.map((day) => {
        // filter shows for each day
        const showsForCurrentDay = this.movie.shows.filter(
          show => formatDate('dd', new Date(show.start)) === formatDate('dd', new Date(day.timestamp))
        );
        const dailySchedule = {};

        this.timeTable.forEach((time) => {
          dailySchedule[time] = showsForCurrentDay.filter(
            show => formatDate('hh:mm', new Date(show.start)) === time
          );
        });

        // return the extended day object with its daily shows
        return {
          ...day,
          shows: dailySchedule,
        };
      });
    },
  },
  methods: {
    goToFirstShow() {
      EventBus.$emit(`${this.carouselId}.goTo`, this.firstShowDayIndex);
    },
  },
  components: {
    'kh-carousel': Carousel,
    'kh-carousel-slide': CarouselSlide,
    'kh-svg-icon': SVGIcon,
  },
};
</script>

<style lang="scss" scoped>
.movie__pre-sale {
  margin: 1em;
}
</style>
