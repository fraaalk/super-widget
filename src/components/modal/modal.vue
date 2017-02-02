<template>
  <transition name="modal__transition">
    <div class="modal__mask"
      @click="closeModal()">
      <div class="modal__wrapper">
        <div 
          :class="modalClasses">
          <button 
            type="button" 
            class="ui-button modal__close"
            @click="closeModal()">
            <kh-svg-icon
              icon-class="ui-button__icon"
              icon-xlink="#svg-close">
            </kh-svg-icon>
          </button>
          <div 
            class="modal__header"
            v-if="showHeader">
            <slot name="header"></slot>
          </div>

          <div class="modal__body">
            <slot name="body"></slot>
          </div>

          <div 
            class="modal__footer"
            v-if="showFooter">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import SVGIcon from './../SVGIcon';

export default {
  props: [
    'showHeader',
    'showFooter',
    'cssClasses',
  ],
  computed: {
    modalClasses() {
      return `modal ${this.cssClasses}`;
    },
  },
  methods: {
    closeModal() {
      this.$emit('close');
    },
  },
  components: {
    'kh-svg-icon': SVGIcon,
  },
};
</script>

<style lang="scss">
.modal {
  background-color: #fff;
  // material md-15
  box-shadow: 
    0 8px 9px -5px rgba(0,0,0,.2), 
    0 15px 22px 2px rgba(0,0,0,.14), 
    0 6px 28px 5px rgba(0,0,0,.12);

  margin: 0px auto;
  padding: 20px 30px;
  position: relative;
  transition: all .3s ease;
  width: 300px;

  &--auditorium-selection {
    width: calc(100vw - 20px);
    max-width: 500px;
  }

  &__mask {
    position: fixed;
    z-index: 9998;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .5);
    display: table;
    background: rgba(0,0,0,.54);
    transition: all .5s cubic-bezier(.35,0,.25,1);
  }

  &__close {
    position: absolute;
    top: 5px;
    right: 5px;
    z-index: 300;
  }

  &__wrapper {
    display: table-cell;
    vertical-align: middle;
  }

  &__footer {

  }

  /*
   * The following styles are auto-applied to elements with
   * transition="modal" when their visibility is toggled
   * by Vue.js.
   */
  &__transition {
    &-enter {
      opacity: 0;

      .modal-container {
        transform: scale(1.1);
      }

      &-active {
        .modal-container {
          transform: scale(0);
        }
      }
    }

    &-leave-active {
      opacity: 0;

      .modal-container {
        transform: scale(1.1);
      }
    }
  }
}
</style>