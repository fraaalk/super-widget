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

        <transition mode="out-in" name="fade">
          <div 
            v-for="(day, index) in days"
            v-if="index === selectedDay">
            shows for the day {{ day.timestamp | localizeWeekDay }} {{ day.timestamp | localizeDate }}
          </div>  
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Carousel from './../carousel/carousel';
import CarouselSlide from './../carousel/carousel-slide';

export default {
  data() {
    return {
      selectedDay: 0,
      carouselConfig: {
        cssClasses: {
          carousel: [
            'carousel--select-day',
          ],
        },
        slidesPerPage: {
          none: 3,
          xs: 4,
          sm: 5,
          md: 5,
          lg: 7,
          xlg: 7,
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
    ]),
    carouselId() {
      return `${this._uid}-carousel`;
    },
  },
  methods: {
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
@import "~family.scss/source/src/family";

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
