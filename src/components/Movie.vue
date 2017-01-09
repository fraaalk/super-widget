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
                    <svg class="ui-image ui-image--responsive ui-image--placeholder" viewBox="0 0 49.7 49.7"><path d="M46.3 24.8c0 11.9-9.6 21.5-21.5 21.5-11.8 0-21.4-9.6-21.4-21.5C3.4 13 13 3.4 24.8 3.4c11.9 0 21.5 9.6 21.5 21.4zM24.6 6.2c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2 6.2-2.8 6.2-6.2c0-3.4-2.8-6.2-6.2-6.2zM12.4 15c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2 6.2-2.8 6.2-6.2-2.8-6.2-6.2-6.2zm4.8 13.5c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2 6.2-2.8 6.2-6.2c0-3.4-2.7-6.2-6.2-6.2zm14.8-.1c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2 6.2-2.8 6.2-6.2c0-3.5-2.8-6.2-6.2-6.2zM37.4 15c-3.4 0-6.2 2.8-6.2 6.2s2.8 6.2 6.2 6.2c3.4 0 6.2-2.8 6.2-6.2S40.8 15 37.4 15zm-12.3 6.3c-1.8 0-3.3 1.5-3.3 3.3s1.5 3.3 3.3 3.3 3.3-1.5 3.3-3.3c0-1.8-1.5-3.3-3.3-3.3z"/></svg>
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <div class="grid__col-12 grid__col-sm-9 grid__col-md-10 grid--order-4 grid--order-sm-3">
      <div class="carousel carousel--3 carousel--sm-4 carousel--md-5 carousel--lg-7">

        <button type="button" rel="prev" data-carousel-button class="ui-button ui-button--secondary ui-corners-left align-self-start is-disabled">
          <div class="ui-button__inner">
            <svg class="ui-button__icon">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" 
                xlink:href="#svg-keyboard_arrow_left"></use>
            </svg>
          </div>
        </button>

        <div class="carousel__wrapper">
          <ul class="carousel__stage is-set" data-carousel-stage>
            <li 
              class="schedule carousel__slide"
              v-for="(day, index) in schedule"
              :class="{'is-ref': index == schedule.length - 1}">

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
            </li>
          </ul>
        </div>

        <button type="button" rel="next" data-carousel-button class="ui-button ui-button--secondary ui-corners-right align-self-start is-disabled">
          <div class="ui-button__inner">
            <svg class="ui-button__icon">
              <use xmlns:xlink="http://www.w3.org/1999/xlink" 
                xlink:href="#svg-keyboard_arrow_right"></use>
            </svg>
          </div>
        </button>
      </div>
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
              {{ movie.language }} <template v-if="movie.subtitle">  / {{ movie.subtitle }}</template>
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
import Carousel from './Carousel';

export default {
  props: ['movie'],
  computed: {
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
