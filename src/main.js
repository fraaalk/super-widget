// The following line loads the standalone build of Vue instead of the runtime-only build,
// so you don't have to do: import Vue from 'vue/dist/vue'
// This is done with the browser options. For the config, see package.json
import Vue from 'vue';
import VueLazyload from 'vue-lazyload';
import VueI18n from 'vue-i18n';
import VueResource from 'vue-resource';
// import VideoPlayer from 'vue-video-player';
import Raven from 'raven-js';
import RavenVue from 'raven-js/plugins/vue';

import App from './App';
import Store from './services/store';
import DataLayer from './services/data-layer';

// 'https://72be0c6b3fbe46e9b60ebd50b10116af@sentry.io/115384'
Raven.config('', {
  environment: window.dataLayer[0].config.assetsEnv,
  release: window.dataLayer[0].config.assetsVersion,
}).addPlugin(RavenVue, Vue).install();

// @TODO load translations via DataLayer
const locales = {
  en: {
    showsList: {
      viewTitle: {
        movies: 'Movie view',
        days: 'Daily view',
        shows: 'List view',
      },
      switch: {
        movies: 'Switch to movie view',
        days: 'Switch to daily view',
        shows: 'Switch to list view',
      },
      tickets: 'tickets',
      duration: 'Duration',
      ageRating: 'Age Rating',
      language: 'Language',
      subTitle: 'Subtitle',
      program: 'Program',
      genre: 'Genre',
      preSaleHint: 'Pre sales start on {date}',
      noDataForTheSelectedDay: 'No data available for the selected date.',
      searchAndFilterShows: 'Search and filter shows',
      title: 'Title',
      originalTitle: 'Original title',
      production: 'Production',
      releaseDate: 'Release date',
      distributor: 'Distributor',
      director: 'Director',
      actors: 'Actors',
    },
  },
  de: {
    showsList: {
      viewTitle: {
        movies: 'Filmansicht',
        days: 'Tagesansicht',
        shows: 'Listenansicht',
      },
      switch: {
        movies: 'Zur Filmansicht wechseln',
        days: 'Zur Tagesansicht wechseln',
        shows: 'Zu Listenansicht wechseln',
      },
    },
    tickets: 'Tickets',
    duration: 'Dauer',
    ageRating: 'FSK',
    language: 'Sprache',
    subTitle: 'Untertitel',
    genre: 'Genre',
    program: 'Programm',
    preSaleHint: 'Vorverkauf für den {date}',
    noDataForTheSelectedDay: 'Leider liegen uns für den gewählten Tag keine Daten vor.',
    searchAndFilterShows: 'Vorstellungen suchen und filtern',
    title: 'Titel',
    originalTitle: 'Originaltitel',
    production: 'Produktion',
    releaseDate: 'Erscheinungsdatum',
    distributor: 'Verleih',
    director: 'Regie',
    actors: 'Darsteller',
  },
};

Vue.use(DataLayer, {
  dataLayer: window.dataLayer,
});

// VideoPlayer.config({
//   youtube: true,
//   switcher: true,
//   hls: false,
// });

// Vue.use(VideoPlayer);

Vue.use(VueLazyload, {
  preLoad: 1.3,
  attempt: 1,
});

Vue.use(VueI18n);
Vue.use(VueResource);

Vue.config.lang = 'de';
Object.keys(locales).forEach((lang) => {
  Vue.locale(lang, locales[lang]);
});

new Vue({ // eslint-disable-line no-new
  el: '#widget',
  store: Store,
  render: h => h(App),
});
