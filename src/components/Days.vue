<template>
  <div class="shows__view shows__view--shows">
    <ul class="ui-list ui-list--movies">
      <li v-for="show in shows">
        <a class="ui-link ui-link--silent grid grid--align-center" :href="show.url">
            <div class="grid__col-3 grid__col-sm-2 grid__cell">
              <span>Sa 07.01.</span>
              <span>{{ show.start | playTime }}</span>
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
import formatDate from 'date-format';

export default {
  computed: {
    shows() {
      const computedShows = window.dataLayer[0].shows;

      return computedShows;
    },
  },
  filters: {
    playTime(timestamp) {
      return `${formatDate('hh', new Date(timestamp))}:${formatDate('mm', new Date(timestamp))}`;
    },
  },
};
</script>

<style lang="scss">
</style>
