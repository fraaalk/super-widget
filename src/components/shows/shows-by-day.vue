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

              <div class="ui-button ui-button--secondary u-no-wrap is-inactive">
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
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Carousel from './../carousel/carousel';
import CarouselSlide from './../carousel/carousel-slide';

export default {
  data() {
    return {
      foo: 'bar',
      carouselConfig: {
        cssClasses: {
          carousel: [
            'carousel--movie',
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
  components: {
    'kh-carousel': Carousel,
    'kh-carousel-slide': CarouselSlide,
  },
};
</script>

<style lang="scss">
</style>
