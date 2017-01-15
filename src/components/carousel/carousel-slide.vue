<template>
  <li 
    class="carousel__slide"
    :class="getClasses()"
    :style="getStyles()">
    <slot>
    </slot>
  </li>
</template>

<script>
export default {
  props: [
    'slideIndex',
    'componentId',
  ],
  computed: {
    // returns the carousel instance from vuex
    carousel() {
      const carousel = this.$store.state.components.filter(component =>
        component.id === this.componentId
      );

      return carousel[0].data;
    },
    currentSlide() {
      return this.carousel.currentSlide;
    },
    refSlide() {
      return this.carousel.refSlide;
    },
    slidesTotal() {
      return this.carousel.slidesTotal;
    },
  },
  methods: {
    getClasses() {
      return this.slideIndex === this.refSlide
        ? 'is-ref'
        : '';
    },

    getStyles() {
      return this.slideIndex === this.refSlide
        ? 'order: 1;'
        : `order: ${(this.slideIndex - this.refSlide) + 1};`;
    },
  },
};
</script>

<style lang="scss">
</style>
