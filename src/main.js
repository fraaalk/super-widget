// The following line loads the standalone build of Vue instead of the runtime-only build,
// so you don't have to do: import Vue from 'vue/dist/vue'
// This is done with the browser options. For the config, see package.json
import 'lazysizes';
import formatDate from 'date-format';
import Vue from 'vue';

import App from './App';
import Store from './services/store';

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

new Vue({ // eslint-disable-line no-new
  el: '#widget',
  store: Store,
  render: h => h(App),
});
