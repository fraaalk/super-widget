<template>
  <div class="page__wrapper page__wrapper--light">
    <div class="page__content">
      <div class="shows">
        <header class="ui-header ui-header--bordered grid grid--align-center">
          <div class="grid__col-12 grid__col-xs-8 grid__col-lg-9 grid--order-2 grid--order-1-xs u-bleed-left">
              <h2 class="ui-title ui-title--small">
                {{ title }}
              </h2>
          </div>
          <div class="grid__col-12 grid__col-xs-4 grid__col-lg-3 grid--order-1 grid--order-2-xs u-bleed-left u-bleed-right">
            <div class="shows__controls">
              <button 
                type="button" 
                class="shows__controls-filter ui-button ui-button--secondary ui-corners"
                :class="{'is-active': showFilters}"
                :title="$t('searchAndFilterShows')"
                @click="showFilters = !showFilters;">
                <div class="ui-button__inner">
                  <kh-svg-icon icon-class="ui-button__icon" icon-xlink="#svg-magnifier"></kh-svg-icon>
                </div>
              </button>

              <div class="shows__controls-layout ui-button-group">
                <button 
                  type="button" 
                  class="ui-button ui-button--secondary"
                  v-for="button in layouts"
                  :title="$t(`showsList.switch.${button.key}`)"
                  :class="{'is-active': (activeLayout == button.key)}"
                  @click="setLayout(button.key)">
                    <kh-svg-icon icon-class="ui-button__icon"
                      :icon-xlink="button.icon">
                    </kh-svg-icon>
                  </button>
              </div>
            </div>
          </div>
        </header>

        <transition mode="out-in" name="transition-fade"
          enter-active-class="animated slideInDown"
          leave-active-class="animated slideOutUp">
          <div v-if="showFilters">
            <input 
              placeholder="... nach einem Film suchen"
              type="text" 
              v-model="filter">
            
            <label>
              <input type="checkbox" v-model="reverse">reverse list?
            </label>
          </div>
        </transition>

        <transition mode="out-in" name="transition-fade">
          <keep-alive>
            <component 
              :is="'kh-shows-by-' + activeLayout">
            </component>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import SVGIcon from './SVGIcon';
import Movies from './../components/shows/shows-by-movie';
import Shows from './../components/shows/shows-by-show';
import Days from './../components/shows/shows-by-day';
import DataLayer from './../services/data-layer';

export default {
  data() {
    return {
      filter: '',
      reverse: false,
      showFilters: false,
      layouts: [
        {
          key: 'movies',
          icon: '#svg-view_module',
        },
        {
          key: 'days',
          icon: '#svg-view_column',
        },
        {
          key: 'shows',
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
    ...mapGetters([
      'now',
      'shows',
    ]),

    /**
     * Returns the currently active layout from vuex
     * @returns {String} - Active layout (movies, days, shows)
     */
    activeLayout() {
      return this.$store.state.activeLayout;
    },

    /**
     * Returns the translated title
     * @returns {String} - Translated title
     */
    title() {
      return `${this.$t('program')} - ${this.$t(`showsList.title.${this.activeLayout}`)}`;
    },
  },
  created() {
    this.generateShows(DataLayer.get('shows'));

    // @TODO: check for set start / end date
    const endDate = DataLayer.get('config.widget.endDate');
    const startDate = DataLayer.get('config.widget.startDate');


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

    /**
     * Returns a real array of the shows object provided by
     * the datalayer.
     * @returns {Array} - Shows array sorted ascending by start
     */
    generateShows(shows) {
      // Convert datalayer shows object to a real array
      // and sort it by start ascending
      const showsArray = Object.keys(shows).map(key =>
        shows[key]
      ).sort((a, b) =>
        a.start - b.start
      );

      // add global filtering of shows which should affect all
      // view variations
      this.$store.state.shows = showsArray;
    },

    // generates the days and pushes them into $store
    generateDays(startDate, endDate) {
      const displayDays = Math.ceil((endDate - startDate) / 86400000) < 7
        ? 7
        : Math.ceil((endDate - startDate) / 86400000);
      let date = startDate;

      for (let i = 0; i <= displayDays; i += 1) {
        this.$store.state.days.push(date);
        date += 86400000;
      }
    },
  },
};
</script>

<style lang="scss">
@import "~family.scss/source/src/family";
@import "~animate.css/source/sliding_entrances/slideInDown";
@import "~animate.css/source/sliding_exits/slideOutUp";

.shows__controls {
  display: flex;

  &-filter {
    width: 25%;
    margin-right: 0.5em;
  }

  &-layout {
    width: calc(75% - 0.5em);
  }
}

.play-times {
  // playtimes styling for days view
  .shows__view--movies & {
    display: flex;
    align-items: stretch;
    margin: 0;
    list-style-type: none;
    flex-direction: column;
    padding: 0;

    > li {
      flex-grow: 1;
      text-align: center;
      margin-top: 1px;
      width: 100%;
    }
  }

  // playtimes styling for days view
  .shows__view--days & {
    display: flex;
    align-items: stretch;
    margin: 0;
    list-style-type: none;
    flex-direction: row;
    flex-wrap: wrap;

    > li {
      flex-grow: 1;
      text-align: center;
      width: 16.666667%;
      
      @include at-least(5) {
        margin-top: 1px;
      }

      @include every(6) { 
        margin-left: 0;
      }

      + li {
        margin-left: 1px;
      }
    }
  }
}
</style>