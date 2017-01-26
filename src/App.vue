<template>
  <div id="widget">
    <kh-widget-header></kh-widget-header>
    <div class="page">
      <kh-shows-list></kh-shows-list>
    </div>
  </div>
</template>

<script>
import WidgetHeader from './components/WidgetHeader';
import Shows from './components/Shows';
import Viewport from './services/viewport';
import EventBus from './services/event-bus';

export default {
  name: 'kh-widget',
  components: {
    'kh-widget-header': WidgetHeader,
    'kh-shows-list': Shows,
  },
  created() {
    this.$store.commit('UPDATE_VIEWPORT', Viewport.get());

    EventBus.$on('viewport.breakpoint', (data) => {
      this.$store.commit('UPDATE_VIEWPORT', data);
    });
  },
};
</script>

<style lang="scss">

// base
@import "vars";
@import "base";
@import "helpers";

// node
@import "~normalize-scss/sass/normalize";
@import "~reflex-grid/scss/reflex";
@import "~breakpoint-sass/stylesheets/breakpoint";
@import "~family.scss/source/src/family";

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

// components
@import "components/page/page";

.page__content {
  padding-top: calc(56px + 16px);
}
</style>