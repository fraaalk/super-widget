<template>
  <div id="widget">
    <widget-header></widget-header>

    <section class="page__wrapper page__wrapper--light">
      <div class="page__content">
        <header class="ui-header ui-header--bordered grid grid--align-center">
          <div class="grid__col-12 grid__col-xs-8 grid__col-lg-10 grid__col--bleed-left">
              <h2 class="ui-title ui-title--small">
                title
              </h2>
          </div>
          <div class="grid__col-12 grid__col-xs-4 grid__col-lg-2 grid__col--bleed-right">
            <kh-choose-widget-layout></kh-choose-widget-layout>
          </div>
        </header>

        <transition mode="out-in" name="fade">
          <component :is="'kh-' + activeLayout">
          </component>
        </transition>
      </div>
    </section>
  </div>
</template>

<script>
import formatDate from 'date-format';
import WidgetHeader from './components/WidgetHeader';
import Movies from './components/Movies';
import Shows from './components/Shows';
import Days from './components/Days';
import ChooseLayout from './components/ChooseLayout';

export default {
  components: {
    'widget-header': WidgetHeader,
    'kh-movies': Movies,
    'kh-shows': Shows,
    'kh-days': Days,
    'kh-choose-widget-layout': ChooseLayout,
  },
  computed: {
    activeLayout() {
      return this.$store.state.activeLayout;
    },
  },
  created() {
    this.generateDays(Date.now(), window.dataLayer[0].shows[47544].start);
    this.tickNow();
  },
  methods: {
    // tick now
    tickNow() {
      setInterval(() => {
        this.$store.state.now = Date.now();
      }, 1000);
    },

    // generates the days and pushes them into $store
    generateDays(inputStartDate = Date.now(), inputEndDate) {
      const startDate = inputStartDate
              ? new Date(parseInt(inputStartDate, 10))
              : new Date(Date.now());
      const endDate = inputEndDate
              ? new Date(parseInt(inputEndDate, 10))
              : new Date(window.dataLayer[0].shows[47544].start);
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
          day: formatDate('dd', date),
          month: formatDate('MM', date),
          weekDay: window.dataLayer[0].config.weekDays[date.getDay()],
          short: formatDate(window.dataLayer[0].config.dateFormats.short, date),
        });
        date.setDate(date.getDate() + 1);
      }
    },
  },
};
</script>

<style lang="scss">

// base
@import "vars";
@import "base";

// node
@import "../node_modules/normalize-scss/sass/normalize";
@import "../node_modules/reflex-grid/scss/reflex";
@import "../node_modules/breakpoint-sass/stylesheets/breakpoint";
@import "../node_modules/family.scss/source/src/family";

// ui
@import "ui/ui";
@import "ui/ui-button";
@import "ui/ui-button-group";
@import "ui/ui-checkbox";
@import "ui/ui-definition-list";
@import "ui/ui-flag";
@import "ui/ui-header";
@import "ui/ui-image";
@import "ui/ui-input";
@import "ui/ui-label";
@import "ui/ui-link";
@import "ui/ui-list";
@import "ui/ui-loader";
@import "ui/ui-radio";
@import "ui/ui-select";


.page__content {
  padding-top: calc(56px + 16px);
}
</style>