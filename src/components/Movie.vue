<template>
  <article :id="movie.movieId">
    <header class="ui-header grid__col-12 grid__cell">
      <span class="ui-title">
        {{ movie.name }}
      </span>
      <span v-for="flag in movie.flags" class="ui-flag">
        {{ flag }}
      </span>
      <div class="grid__col-5 grid__col-xs-3 grid__col-md-2 grid__col--bleed">
        <div class="grid">
          <div class="grid__col-12">
            <div class="ui-aspect ui-aspect-7-10">
              <div class="ui-aspect__inner">
                <template v-if="movie.lazyImage">
                  <img class="ui-image ui-image--responsive ui-image--lazyload" :src="'https://www.kinoheld.de' + movie.lazyImage" :alt="movie.name">
                </template>
                <template v-else>
                  <svg class="ui-image ui-image--responsive ui-image--placeholder">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-movieroll"></use>
                  </svg>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="grid__col-12 grid__col-sm-9 grid__col-md-10 grid--order-4 grid--order-sm-3">
      <kh-carousel 
        :slidesDefault="slidesDefault"
        :slidesResponsive="slidesResponsive"
        :totalSlides="schedule.length"
        :componentId="carouselId">

        <kh-carousel-slide 
          v-for="(day, index) in schedule"
          :slideIndex="index"
          :componentId="carouselId">
          <div class="ui-button ui-button--secondary is-inactive">
            <template v-if="today == day.timestamp">
              <strong>Heute</strong>
            </template>
            <template v-else>
              {{ day.timestamp | localizeWeekDay }} {{ day.timestamp | localizeDate }}
            </template>
          </div>

          <ul class="schedule__times">
            <li v-for="(show, time) in day.shows">
              <a v-if="show.length"
                class="ui-button ui-button--cta" 
                :href="show[0].url"
                :class="{'is-disabled': now >= show[0].start}">
                {{ time }}
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
    </div>


    <div class="grid__col-7 grid__col-sm-9 grid__col-md-10 grid--order-2 grid--order-sm-5">
      <div class="movie-info movie-info--short">
        <dl class="ui-defintion-list ui-definition-list--inline">
          <template v-if="movie.duration">
            <dt>Duration<!-- <?php echo t('labels|Duration'); ?> --></dt>
            <dd> {{ movie.duration }} <!-- <?php echo t('bookings|minutes'); ?> --></dd>
          </template>
          <template v-if="movie.ageRating">
            <dt>AgeRating<!-- <?php echo t('MPAA'); ?> --></dt>
            <dd>{{ movie.ageRating }}</dd>
          </template>
          <template v-if="movie.language">
            <dt>
              Language <template v-if="movie.subtitle">/ Subtitle </template>
              <!-- <?php echo t('Language'); ?><% if (show.subtitle) { %> / <?php echo t('Subtitle'); ?><% } %> -->
            </dt>
            <dd>
              {{ movie.language }} <template v-if="movie.subtitle"> / {{ movie.subtitle }}</template>
            </dd>
          </template>
          <template v-if="movie.genre">
            <dt>
              Genre <!--<?php echo t('Genre'); ?>-->
            </dt>
            <dd>{{ movie.genre }}</dd>
          </template>
        </dl>
      </div>
    </div>
  </article>
</template>

<script>
import { mapGetters } from 'vuex';
import formatDate from 'date-format';
import Carousel from './carousel/carousel';
import CarouselSlide from './carousel/carousel-slide';

export default {
  props: ['movie'],
  data() {
    return {
      slidesDefault: 3,
      slidesResponsive: {
        sm: 4,
        md: 5,
        lg: 7,
      },
    };
  },
  computed: {
    // creates a unique identifier to store the carousek state in vuex
    carouselId() {
      return `movie-${this._uid}-carousel`;
    },

    // get today and days array from vuex store
    ...mapGetters([
      'now',
      'today',
      'days',
    ]),

    // returns the unique timetable with all different play times for this movie
    timeTable() {
      const playTimes = this.movie.shows.map(
        show => `${formatDate('hh', new Date(show.start))}:${formatDate('mm', new Date(show.start))}`
      );

      return [...new Set(playTimes)];
    },

    schedule() {
      return this.days.map((day) => {
        // filter shows for each day
        const showsForCurrentDay = this.movie.shows.filter(
          show => formatDate('dd', new Date(show.start)) === day.day
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
  components: {
    'kh-carousel': Carousel,
    'kh-carousel-slide': CarouselSlide,
  },
};
</script>

<style lang="scss">
@import "../../node_modules/family.scss/source/src/family";
// .schedule
// element class containing .schedule-day and .schedule-times styling
.schedule {

    // .schedule-times
    // list of showtimes for a movie in a horizontal or vertical view
    &__times {
        display: flex;
        align-items: stretch;
        margin: 0;
        list-style-type: none;

        // .shows__view--movies .schedule-times
        // vertical view
        .shows__view--movies & {
            flex-direction: column;
            padding: 0;
        }

        // .shows__view--days .schedule-times
        // horizontal view
        .shows__view--days & { 
            flex-direction: row;
            flex-wrap: wrap;
        }

        > li {
            flex-grow: 1;
            text-align: center;
            
        }

        > li {
            .shows__view--days & {
                width: 16.666667%;
            }

            @include at-least(5) {
                .shows__view--days & {
                    margin-top: 1px;
                }
            }

            @include every(6) { 
                .shows__view--days & {
                    margin-left: 0;
                }
            }

            .shows__view--movies & { 
                margin-top: 1px;
                width: 100%;
            }
        }

        > li + li {

            
            .shows__view--days & {
                margin-left: 1px;
            }
        }
    }
}
</style>
