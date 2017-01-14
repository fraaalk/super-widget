<template>
  <svg :class="iconClass">
    <use xmlns:xlink="http://www.w3.org/1999/xlink" :xlink:href="iconXlink"></use>
  </svg>
</template>

<script>
export default {
  props: [
    'iconClass',
    'iconXlink',
  ],
};
</script>

<style lang="scss">
</style>