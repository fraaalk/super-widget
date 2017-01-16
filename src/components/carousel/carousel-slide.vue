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
    slide() {
      const slide = this.$store.state.components[this.componentId].slides.filter(key =>
        key.id === this._uid
      );
      return slide[0];
    },
    ref() {
      return this.$store.state.components[this.componentId].refSlide;
    },
  },
  methods: {
    getClasses() {
      return this.slide.class;
    },

    getStyles() {
      return this.slide.styles;
    },
  },
  created() {
    this.$store.commit('ADD_SLIDE', {
      carouselId: this.componentId,
      data: {
        id: this._uid,
        styles: '',
        class: this.slideIndex === this.ref
          ? 'is-ref'
          : '',
      },
    });
  },
};
</script>

<style lang="scss">
</style>
