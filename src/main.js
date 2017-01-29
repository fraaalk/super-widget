// The following line loads the standalone build of Vue instead of the runtime-only build,
// so you don't have to do: import Vue from 'vue/dist/vue'
// This is done with the browser options. For the config, see package.json
import Vue from 'vue';
import VueLazyload from 'vue-lazyload';
import VueI18n from 'vue-i18n';
import formatDate from 'date-format';

import App from './App';
import Store from './services/store';

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
      subtitle: 'Subtitle',
      genre: 'Genre',
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
    subtitle: 'Untertitel',
    genre: 'Genre',
  },
};

Vue.filter('localizeTime',
  timestamp => `${formatDate('hh:mm', new Date(timestamp))}`
);

Vue.filter('localizeDate',
  timestamp => `${formatDate('dd.MM.', new Date(timestamp))}`
);

Vue.filter('localizeWeekDay', (timestamp) => {
  const date = new Date(timestamp);
  return window.dataLayer[0].config.weekDays[date.getDay()];
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
