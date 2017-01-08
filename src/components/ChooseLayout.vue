<template>
  <div class="ui-button-group">
      <button type="button" class="ui-button ui-button--secondary"
        v-for="button in buttons"
        :title="button.title"
        :class="{'is-active': (activeLayout == button.key)}"
        @click="setLayout(button.key)">
        <svg class="ui-button__icon">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" 
            :xlink:href="button.icon"></use>
        </svg>
      </button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      buttons: [
        {
          key: 'movies',
          title: 'Filmansicht',
          icon: '#svg-view_module',
        },
        {
          key: 'days',
          title: 'Tagesansicht',
          icon: '#svg-view_column',
        },
        {
          key: 'shows',
          title: 'Listenansicht',
          icon: '#svg-view_list',
        },
      ],
    };
  },
  computed: {
    activeLayout() {
      return this.$store.state.activeLayout;
    },
  },
  methods: {
    setLayout(value) {
      this.$store.state.activeLayout = value;
    },
  },
};
</script>

<style lang="scss">

</style>
