<template>
  <section class="page__wrapper page__wrapper--light">
    <div class="page__content">
      <header class="ui-header ui-header--bordered grid grid--align-center">
        <div class="grid__col-12 grid__col-xs-8 grid__col-lg-10 u-bleed-left">
            <h2 class="ui-title ui-title--small">
              {{ title }}
            </h2>
        </div>
        <div class="grid__col-12 grid__col-xs-4 grid__col-lg-2 u-bleed-right">
          <div class="ui-button-group">
            <button type="button" class="ui-button ui-button--secondary"
              v-for="button in layouts"
              :title="button.title"
              :class="{'is-active': (activeLayout == button.key)}"
              @click="setLayout(button.key)">
                <kh-svg-icon
                  icon-class="ui-button__icon"
                  :icon-xlink="button.icon">
                </kh-svg-icon>
              </button>
          </div>
        </div>
      </header>

      <transition mode="out-in" name="transition-fade">
        <keep-alive>
          <component :is="'kh-shows-by-' + activeLayout"></component>
        </keep-alive>
      </transition>
    </div>
  </section>
</template>

<script>
// import formatDate from 'date-format';

import SVGIcon from './SVGIcon';
import Movies from './../components/shows/shows-by-movie';
import Shows from './../components/shows/shows-by-show';
import Days from './../components/shows/shows-by-day';
import DataLayer from './../services/data-layer';

export default {
  data() {
    return {
      layouts: [
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
  components: {
    'kh-shows-by-movies': Movies,
    'kh-shows-by-shows': Shows,
    'kh-shows-by-days': Days,
    'kh-svg-icon': SVGIcon,
  },
  computed: {
    activeLayout() {
      return this.$store.state.activeLayout;
    },

    title() {
      // should be title
      return this.$store.state.activeLayout;
    },
  },
  created() {
    const showDates = Object.keys(DataLayer.get('shows')).map(show =>
      DataLayer.get(`shows.${show}.start`)
    );

    const endDate = Math.max(...showDates);
    const startDate = Date.now();

    this.generateDays(startDate, endDate);
    // this.tickNow();
  },
  methods: {
    // sets the layout
    setLayout(value) {
      this.$store.state.activeLayout = value;
    },

    // tick now
    tickNow() {
      setInterval(() => {
        this.$store.state.now = Date.now();
      }, 1000);
    },

    // generates the days and pushes them into $store
    generateDays(inputStartDate, inputEndDate) {
      const startDate = new Date(parseInt(inputStartDate, 10));
      const endDate = new Date(parseInt(inputEndDate, 10));
      const date = new Date(startDate);
      let displayDays;

      date.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);
      startDate.setHours(0, 0, 0, 0);
      displayDays = (endDate.getTime() - startDate.getTime()) / 86400000;

      // displayDays should be at least a week
      if (displayDays < 7) {
        displayDays = 7;
      }

      for (let i = 0; i <= displayDays; i += 1) {
        this.$store.state.days.push({
          timestamp: new Date(date).getTime(),
        });
        date.setDate(date.getDate() + 1);
      }
    },
  },
};
</script>

<style lang="scss">
</style>