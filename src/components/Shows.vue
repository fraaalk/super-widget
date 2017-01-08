<template>
  <div class="shows__view shows__view--shows">
    <ul class="ui-list ui-list--movies">
      <li 
        v-for="show in shows" 
        v-if="now < show.start">
        <a class="ui-link ui-link--silent grid grid--align-center" 
          :href="show.url">
            <div class="grid__col-3 grid__col-sm-2 grid__cell">
              <span>{{ show.start | localizeWeekDay }} {{ show.start | localizeDate }}</span>
              <span>{{ show.start | localizeTime }}</span>
            </div>
            <div class="grid__col-6 grid__col-sm-7 grid__cell">
              {{ show.name }}
            </div>
            <div class="grid__col-3 grid__col-sm-3 grid--align-content-end">
              <div class="ui-button ui-button--cta ui-corners u-text-center">
                <div class="ui-button__inner">
                  Tickets
                </div>
              </div>
            </div>
          </a>
      </li>
    </ul>
  </div>
</template>

<script>
import sortBy from 'lodash/sortBy';
import { mapGetters } from 'vuex';

const _ = {
  sortBy,
};

export default {
  computed: {
    // get now vuex store
    ...mapGetters([
      'now',
      'today',
    ]),

    shows() {
      const computedShows = _.sortBy(window.dataLayer[0].shows, 'start');

      return computedShows;
    },
  },
};
</script>

<style lang="scss">
</style>
