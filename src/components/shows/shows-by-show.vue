<template>
  <div class="shows__view shows__view--shows">
    <ul class="ui-list ui-list--shows">
      <li 
        v-for="show in showsList" 
        v-if="now < show.start">
        <a class="ui-link ui-link--silent grid grid--align-center" 
          :href="show.url">
            <div class="grid__col-3 grid__col-sm-2 grid__cell">
              <span>{{ getFormattedWeekDay(show.start) }} {{ getFormattedDate(show.start) }}</span>
              <span>{{ getFormattedTime(show.start) }}</span>
            </div>
            <div class="grid__col-6 grid__col-sm-7 grid__cell">
              {{ show.name }}
              <span class="ui-flag" v-for="flag in show.flags">
                {{ flag }}
              </span>
            </div>
            <div class="grid__col-3 grid__col-sm-3 grid--align-content-end">
              <div class="ui-button ui-button--cta ui-corners u-text-center">
                <div class="ui-button__inner">
                  {{ $t('tickets') }}
                </div>
              </div>
            </div>
          </a>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import showsMixin from './../shows/shows-mixin';
import dateFormatMixin from './../../mixins/date-format';

export default {
  mixins: [
    showsMixin,
    dateFormatMixin,
  ],
  computed: {
    ...mapGetters([
      'now',
      'shows',
    ]),

    /**
     * Returns all shows sorted ascending by start time
     * @returns {Array} - Array of sorted shows
     */
    showsList() {
      const shows = this.shows;

      return shows.sort((a, b) =>
        a.start - b.start
      );
    },
  },
};
</script>

<style lang="scss">
</style>
