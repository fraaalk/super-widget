<template>
  <header class="widget-header">
    <nav 
      class="widget-header__navigation" 
      :class="{ 'is-visible': isMenuVisible }">
        <img 
          class="widget-header__logo" 
          :src="logo">
        <ul v-if="isMenuVisible">
          <li v-for="item in menu"> 
            <a 
              :href="item.url" 
              :title="item.name" 
              target="_blank">
                {{ item.name }}
            </a>
          </li>
        </ul>
    </nav>

    <button 
        class="widget-header__toggle" 
        type="button" 
        :class="{ 'is-active': isMenuVisible }"
        @click="isMenuVisible = !isMenuVisible">
        <div class="ui-button__inner">
          <kh-svg-icon
            icon-class="ui-button__icon"
            icon-xlink="#svg-close"
            v-if="isMenuVisible">
          </kh-svg-icon>
          <kh-svg-icon
            icon-class="ui-button__icon"
            icon-xlink="#svg-menu"
            v-else>
          </kh-svg-icon>
        </div>
    </button>

    <transition name="fade">
      <div 
        class="widget-header__backdrop" 
        v-if="isMenuVisible" 
        @click="isMenuVisible = false">
      </div>
    </transition>
  </header>
</template>

<script>
import SVGIcon from './SVGIcon';

export default {
  data() {
    return {
      logo: '',
      menu: [],
      isMenuVisible: false,
    };
  },
  created() {
    window.addEventListener('message', (event) => {
      if (!event.data || typeof (event.data) !== 'object') {
        return;
      }

      const message = JSON.parse(event.data);

      if (message.topic && message.topic === 'if_menu') {
        this.menu(message.data);
      }
    });

    window.parent.postMessage('if_get_menu', '*');

    this.menu = [{
      name: 'Impressum',
      url: 'https://www.kinoheld.de/impressum',
    }, {
      name: 'Kontakt',
      url: 'https://www.kinoheld.de/kontakt',
    }];

    this.logo = 'http://www.munich-startup.de/wp-content/uploads/2015/08/kinoheld_logo_sw-320x136.jpg';
  },
  components: {
    'kh-svg-icon': SVGIcon,
  },
};
</script>

<style lang="scss">
$headerHeight: 56px;

.widget-header {
  background: #ccc;
  height: $headerHeight;
  display: flex;
  position: fixed;
  justify-content: space-between;
  box-shadow: 
    0 1px 3px rgba(0,0,0,.2), 
    0 1px 1px rgba(0,0,0,.14), 
    0 2px 1px -1px rgba(0,0,0,.12);
  top: 0;
  left: 0;
  width: 100%;
  z-index: 100;

  &__logo {
    margin-left: 1rem;
    flex-shrink: 1;
    flex-grow: 0;
  }

  &__toggle {
    border: none;
    background: none;
    outline: none;
    width: 48px;
    height: 48px;
    cursor: pointer;
    z-index: 101;
    position: fixed;
    top: 4px;
    right: 4px;

    svg {
      width: 24px;
      height: 24px;
    }
  }

  &__backdrop {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 99;
      background-color: rgba(0,0,0,.54);
      transition: all .5s cubic-bezier(.35,0,.25,1);
      transition-property: opacity;
      will-change: opacity;
  }

  &__navigation {
    position: fixed;
    top: $headerHeight;
    height: 100vh;
    width: 280px;
    top: 0;
    right: 0;
    transform: translate3D(100%, 0, 0);
    transition: transform 0.1s cubic-bezier(.35,0,.25,1);
    background: white;
    padding-top: 56px;
    z-index: 100;

    &.is-visible {
      transform: translate3D(0, 0, 0);
      box-shadow: 
        0 8px 10px -5px rgba(0,0,0,.2), 
        0 16px 24px 2px rgba(0,0,0,.14), 
        0 6px 30px 5px rgba(0,0,0,.12);
    }

    ul {
      list-style-type: none;
      margin: 0;
      padding: 0;

      li {
        background: #ccc;
      }
    }
  }
}


</style>
