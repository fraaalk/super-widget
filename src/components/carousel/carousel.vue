<template>
  <div 
    class="carousel"
    :class="carouselClasses">
    {{ currentSlide }}
    <button 
      type="button" 
      class="ui-button ui-button--secondary ui-corners-left align-self-start"
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
      class="ui-button ui-button--secondary ui-corners-right align-self-start"
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
import SVGIcon from './../SVGIcon';

export default {
  data() {
    return {
      isAnimating: false,
      visibleSlides: 5,
    };
  },
  props: [
    'initialClasses',
    'slidesDefault',
    'slidesResponsive',
    'componentId',
    'totalSlides',
  ],
  computed: {
    carousel() {
      return this.$store.state.components[this.componentId];
    },
    currentSlide() {
      return this.carousel.currentSlide;
    },
    slides() {
      return this.carousel.slides;
    },

    carouselClasses() {
      let carouselClasses = `carousel--${this.slidesDefault}`;

      Object.keys(this.slidesResponsive).forEach((key) => {
        carouselClasses += ` carousel--${key}-${this.slidesResponsive[key]}`;
      });

      return carouselClasses;
    },

    slidePrevEnabled() {
      return this.currentSlide > 0;
    },

    slideNextEnabled() {
      return this.totalSlides - (this.visibleSlides + this.currentSlide) > 0;
    },

    stageClasses() {
      return !this.isAnimating ? 'is-set' : '';
    },
  },
  methods: {
    slide(isReversing) {
      const slides = this.slides;
      const totalSlides = this.totalSlides;
      let currentSlide = this.currentSlide;
      let newSlide;
      let refSlide;

      if (isReversing) {
        newSlide = currentSlide > 0
          ? currentSlide -= 1
          : 0;
      } else {
        newSlide = currentSlide < totalSlides
          ? currentSlide += 1
          : totalSlides;
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

      this.$store.commit('UPDATE_COMPONENT', {
        componentId: this.componentId,
        data: {
          currentSlide: newSlide,
          refSlide,
          slides,
          totalSlides,
        },
      });
    },
    slidePrev() {
      if (this.slidePrevEnabled) {
        this.slide(true);
      }
    },
    slideNext() {
      if (this.slideNextEnabled) {
        this.slide(false);
      }
    },
  },
  components: {
    'kh-svg-icon': SVGIcon,
  },
  created() {
    // temporary var move to viewport service soon

    // create a unique id
    this.$store.commit('ADD_COMPONENT', {
      componentId: this.componentId,
      data: {
        currentSlide: 0,
        totalSlides: this.totalSlides,
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

        // 3 default
        .carousel--3 & {
            left: -33.33333333333333%;
            transform: translateX(33.33333333333333%);

            &.is-reversing {
                transform: translateX(-33.33333333333333%);
            }

            &.is-set {
                transform: none;
                transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            }
        }

        // 3 default
        .carousel--2 & {
            left: -50%;
            transform: translateX(50%);

            &.is-reversing {
                transform: translateX(-50%);
            }

            &.is-set {
                transform: none;
                transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
            }
        }

        @include breakpoint( $bp-xs-up ) { 
            .carousel--xs-3 & {
                left: -33.33333333333333%;
                transform: translateX(33.33333333333333%);

                &.is-reversing {
                    transform: translateX(-33.33333333333333%);
                }

                &.is-set {
                    transform: none;
                    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                }
            }
        }

        // 600+
        @include breakpoint( $bp-sm-up ) { 
            .carousel--sm-4 & {
                left: -25%;
                transform: translateX(25%);

                &.is-reversing {
                    transform: translateX(-25%);
                }

                &.is-set {
                    transform: none;
                    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                }
            }

            .carousel--sm-5 & {
                left: -20%;
                transform: translateX(20%);

                &.is-reversing {
                    transform: translateX(-20%);
                }

                &.is-set {
                    transform: none;
                    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                }
            }
        }

        // 768+
        @include breakpoint( $bp-md-up ) { 
            .carousel--md-5 & {
                left: -20%;
                transform: translateX(20%);

                &.is-reversing {
                    transform: translateX(-20%);
                }

                &.is-set {
                    transform: none;
                    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                }
            }
        }

        // 992+
        @include breakpoint( $bp-lg-up ) { 
            .carousel--lg-6 & {
                left: -16.6666666667%;
                transform: translateX(16.6666666667%);

                &.is-reversing {
                    transform: translateX(-16.6666666667%);
                }

                &.is-set {
                    transform: none;
                    transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
                }
            }

            .carousel--lg-7 & {
                left: -14.28571428571429%;
                transform: translateX(14.28571428571429%);

                &.is-reversing {
                    transform: translateX(-14.28571428571429%);
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

        // default
        .carousel--3 & {
            flex-basis: 33.33333333333333%;
        }

        .carousel--2 & {
            flex-basis: 50%;
        }

        // 600+
        @include breakpoint( $bp-xs-up ) {
            .carousel--xs-3 & { 
                flex-basis: 33.33333333333333%;
            }
        }

        // 600+
        @include breakpoint( $bp-sm-up ) {
            .carousel--sm-4 & {
                flex-basis: 25%;
            }

            .carousel--sm-5 & {
                flex-basis: 20%;
            }
        }

        // 768+
        @include breakpoint( $bp-md-up ) {
            .carousel--md-5 & {
                flex-basis: 20%;
            }
        }

        // 992+
        @include breakpoint( $bp-lg-up ) {
            .carousel--lg-6 & {
                flex-basis: 16.6666666667%;
            }

            .carousel--lg-7 & {
                flex-basis: 14.28571428571429%;
            }
        }
    }
}
</style>
