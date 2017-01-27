<template>
  <div 
    class="carousel"
    :class="carouselClasses">
    <button 
      type="button" 
      class="carousel__button carousel__button--prev ui-button ui-button--secondary ui-corners-left u-align-self-start"
      :class="{'is-disabled': !slidePrevEnabled}"
      @click='slidePrev'>
      <div class="ui-button__inner">
        <kh-svg-icon 
          icon-class="ui-button__icon" 
          icon-xlink="#svg-keyboard_arrow_left">
        </kh-svg-icon>
      </div>
    </button>

    <div class="carousel__wrapper">
      <ul 
        class="carousel__stage"
        :class="stageClasses">
        <slot></slot>
      </ul>
    </div>

    <button 
      type="button" 
      class="carousel__button carousel__button--next ui-button ui-button--secondary ui-corners-right u-align-self-start"
      :class="{'is-disabled': !slideNextEnabled}"
      @click="slideNext">
      <div class="ui-button__inner">
        <kh-svg-icon 
          icon-class="ui-button__icon" 
          icon-xlink="#svg-keyboard_arrow_right">
        </kh-svg-icon>
      </div>
    </button>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SVGIcon from './../SVGIcon';
import EventBus from './../../services/event-bus';

export default {
  data() {
    return {
      isAnimating: false,
      isReversing: false,
    };
  },
  props: [
    'slidesPerPage',
    'componentId',
    'totalSlides',
    'cssClasses',
  ],
  computed: {
    /**
     * Fetches common getters from vuex for the component
     */
    ...mapGetters([
      'currentBreakpoint',
    ]),

    /**
     * Returns the currently visible slides for the current
     * breakpoint
     * @returns {Number} - The number of visible slides
     */
    visibleSlides() {
      return this.slidesPerPage[this.currentBreakpoint];
    },

    /**
     * Returns the component reference from vuex for
     * the current state of the carousel
     * @returns {Object} - Reference to component state
     */
    carousel() {
      return this.$store.state.components[this.componentId];
    },

    /**
     * Returns the current slide
     * @returns {Number} - Current slide number
     */
    currentSlide() {
      return this.carousel.currentSlide;
    },

    /**
     * Returns the last slide which is slidable
     * if more than one slide is displayed
     * @returns {Number} - Last slidable slide
     */
    lastSlide() {
      return this.totalSlides - this.visibleSlides;
    },

    /**
     * Returns the slides of the carousel
     * @returns {Array} - Array of slides
     */
    slides() {
      return this.carousel.slides;
    },

    /**
     * Returns computed css classes for the carousel
     * @returns {String} - Css classes
     */
    carouselClasses() {
      const carouselClasses = [`carousel--${this.slidesPerPage[this.currentBreakpoint]}`];

      // Add custom classes if provided
      if (this.cssClasses && this.cssClasses.carousel) {
        carouselClasses.push(this.cssClasses.carousel);
      }

      // If totalSlides matches currently visible slides add the inactive
      // class to cancel flexbox ordering of carousel slides
      if (this.totalSlides === this.visibleSlides) {
        carouselClasses.push('is-inactive');
      }

      return carouselClasses.join(' ');
    },

    /**
     * Returns computed css classes for the carousel stage
     * @returns {Object} - Css classes
     */
    stageClasses() {
      return {
        'is-set': !this.isAnimating,
        'is-reversing': this.isReversing,
      };
    },

    /**
     * Returns indicator wether sliding backwards is allowed or not
     * @returns {Boolean}
     */
    slidePrevEnabled() {
      return this.currentSlide > 0;
    },

    /**
     * Returns indicator wether sliding forward is allowed or not
     * @returns {Boolean}
     */
    slideNextEnabled() {
      return this.totalSlides - (this.visibleSlides + this.currentSlide) > 0;
    },
  },
  methods: {
    /**
     * Slides the carousel
     * @param {Boolean} isReversing - Reverse the animation
     * @param {Number} slideIndex - Jump to a specific slideIndex
     */
    slide(isReversing, slideIndex = null) {
      const slides = this.slides;
      const totalSlides = this.totalSlides;
      let currentSlide = this.currentSlide;
      let refSlide;
      let newSlide;

      if (slideIndex && !isReversing) {
        newSlide = slideIndex > this.lastSlide
          ? this.lastSlide
          : slideIndex;
      } else if (slideIndex && isReversing) {
        newSlide = slideIndex < this.lastSlide
          ? this.lastSlide
          : slideIndex;
      } else if (!slideIndex && !isReversing) {
        newSlide = currentSlide < totalSlides
          ? currentSlide += 1
          : totalSlides;
      } else {
        newSlide = currentSlide > 0
          ? currentSlide -= 1
          : 0;
      }

      if (newSlide === 0) {
        refSlide = totalSlides - 1;
      } else if (newSlide === 1 || newSlide > totalSlides) {
        refSlide = 0;
      } else {
        refSlide = newSlide - 1;
      }

      let i;
      let j = 1;
      for (i = 0; i < this.slides.length; i += 1) {
        const pointer = (i + refSlide) % this.slides.length;

        if (pointer === refSlide) {
          this.slides[pointer].styles = 'order: 1;';
          this.slides[pointer].class = 'is-ref';
        } else {
          this.slides[pointer].styles = `order: ${j}`;
          this.slides[pointer].class = '';
        }

        j += 1;
      }

      this.isAnimating = true;
      window.setTimeout(() => {
        this.isAnimating = false;
      }, 50);

      // Store component mutation in vuex
      this.$store.commit('UPDATE_COMPONENT', {
        componentId: this.componentId,
        data: {
          visibleSlides: this.visibleSlides,
          currentSlide: newSlide,
          refSlide,
          slides,
          totalSlides,
        },
      });
    },

    /**
     * Determines animation direction and then jumps to given slideIndex
     * @param {Number} slideIndex
     */
    goTo(slideIndex) {
      this.isReversing = this.currentSlide > slideIndex;
      this.slide(this.isReversing, slideIndex);
    },

    /**
     * Slides 1 slide to the left
     */
    slidePrev() {
      if (this.slidePrevEnabled) {
        this.isReversing = true;
        this.slide(true, null);
      }
    },

    /**
     * Slides 1 slide to the right
     */
    slideNext() {
      if (this.slideNextEnabled) {
        this.isReversing = false;
        this.slide(false, null);
      }
    },
  },
  components: {
    'kh-svg-icon': SVGIcon,
  },
  created() {
    // Register go to slide event listener and make it
    // accessible for other components
    EventBus.$on(`${this.componentId}.goTo`, (slideIndex) => {
      this.goTo(slideIndex);
    });

    // Add the component in its current state to vuex
    this.$store.commit('ADD_COMPONENT', {
      componentId: this.componentId,
      data: {
        currentSlide: 0,
        totalSlides: this.totalSlides,
        visibleSlides: this.visibleSlides,
        refSlide: this.totalSlides - 1,
        slides: [],
      },
    });
  },
};
</script>

<style lang="scss">
@import "../../vars";
@import "../../../node_modules/breakpoint-sass/stylesheets/breakpoint";

$carouselVariations: (
  2: 50%,
  3: 33.33333333333333%,
  4: 25%,
  5: 20%,
  6: 16.6666666667%,
  7: 14.28571428571429%
);

// http://madewithenvy.com/ecosystem/articles/2015/exploring-order-flexbox-carousel/
.carousel {
  display: flex;

  &__wrapper {
    width: 100%;
    overflow: hidden;
    margin: 0 1px;
  }

  &__stage {
    display: flex;
    flex-grow: 1;
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
    left: -100%;
    transform: translateX(100%);

    .is-inactive & {
      transform: 0 !important;
      left: 0 !important;
    }

    &.is-reversing {
      transform: translateX(-100%);
    }

    &.is-set {
      transform: none;
      transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
    }

    @each $variationName, $value in $carouselVariations {
      .carousel--#{$variationName} & {
        left: -$value;
        transform: translateX($value);

        &.is-reversing {
          transform: translateX(-$value);
        }

        &.is-set {
          transform: none;
          transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
        }
      }
    }
  }

  &__slide {
    flex: 1 0 100%;
    order: 2;
    margin-right: 1px;
    min-width: 0; // hack to make text ellipsis work inside of flexbox

    &.is-ref {
      order: 1;
      margin-right: 0;
    }

    // If the carousel is inactive equal all slides
    // and remove the ordering for the referenced one
    .is-inactive & {
      order: 0 !important;

      &:last-child {
        margin-right: 0;
      }
    }

    @each $variationName, $value in $carouselVariations {
      .carousel--#{$variationName} & {
        flex-basis: $value;
      }
    }
  }
}
</style>
