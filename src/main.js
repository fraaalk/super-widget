// The following line loads the standalone build of Vue instead of the runtime-only build,
// so you don't have to do: import Vue from 'vue/dist/vue'
// This is done with the browser options. For the config, see package.json
import Vue from 'vue';
import VueLazyload from 'vue-lazyload';
import VueI18n from 'vue-i18n';
import formatDate from 'date-format';

import App from './App';
import Store from './services/store';
import DataLayer from './services/data-layer';

// @TODO load translations via DataLayer
const locales = {
  en: {
    showsList: {
      title: {
        movies: 'Movie view',
        days: 'Daily view',
        shows: 'List view',
      },
      switch: {
        movies: 'Switch to movie view',
        days: 'Switch to daily view',
        shows: 'Switch to list view',
      },
      duration: 'Duration',
      ageRating: 'Age Rating',
      language: 'Language',
      subTitle: 'Subtitle',
      program: 'Program',
      genre: 'Genre',
      preSaleHint: 'Pre sales start on {date}',
      noDataForTheSelectedDay: 'No data available for the selected date.',
      searchAndFilterShows: 'Search and filter shows',
    },
  },
  de: {
    showsList: {
      title: {
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
    duration: 'Dauer',
    ageRating: 'FSK',
    language: 'Sprache',
    subTitle: 'Untertitel',
    genre: 'Genre',
    program: 'Programm',
    preSaleHint: 'Vorverkauf für den {date}',
    noDataForTheSelectedDay: 'Leider liegen uns für den gewählten Tag keine Daten vor.',
    searchAndFilterShows: 'Vorstellungen suchen und filtern',
  },
};

Vue.filter('localizeTime',
  timestamp => `${formatDate('hh:mm', new Date(timestamp), DataLayer.get('config.timezoneOffset'))}`
);

Vue.filter('localizeDate',
  timestamp => `${formatDate('dd.MM.', new Date(timestamp), DataLayer.get('config.timezoneOffset'))}`
);

Vue.filter('localizeWeekDay', (timestamp) => {
  const date = new Date(timestamp);
  const weekDays = DataLayer.get('config.weekDays');
  return weekDays[date.getDay()];
});

// VueLazyload: https://github.com/hilongjw/vue-lazyload
Vue.use(VueLazyload, {
  preLoad: 1.3,
  // error: 'dist/error.png',
  // loading: 'dist/loading.gif',
  attempt: 1,
});

// VueI18n: https://kazupon.github.io/vue-i18n
Vue.use(VueI18n);
Vue.config.lang = 'de';
Object.keys(locales).forEach((lang) => {
  Vue.locale(lang, locales[lang]);
});

new Vue({ // eslint-disable-line no-new
  el: '#widget',
  store: Store,
  render: h => h(App),
});
