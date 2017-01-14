<template>
  <li 
    class="carousel__slide"
    :class="{'is-ref': slideIndex === currentSlide }">
    {{ currentSlide }} ###
    <slot>
    </slot>
  </li>
</template>

<script>
export default {
  props: [
    'slideIndex',
    'currentSlide',
    'slidesTotal',
  ],
  created() {
    // console.log(this.slideIndex, this.slidesTotal, this.currentSlide);
  },
};
</script>

<style lang="scss">
</style>
