import $ from 'jquery';
import { CONFIG } from '../config.js';
import { State } from '../state.js';

export const Toast = {
    $el: null,

    ensureElement() {
        if (this.$el) return;
        this.$el = $('<div id="surfline-toast"></div>');
        this.$el.css(CONFIG.TOAST_STYLES);
        $('body').append(this.$el);
    },

    show(message) {
        this.ensureElement();
        this.$el.text(message);
        this.$el.css('opacity', '1');

        if (State.toastTimeoutId) {
            clearTimeout(State.toastTimeoutId);
        }

        State.toastTimeoutId = setTimeout(() => {
            this.$el.css('opacity', '0');
            State.toastTimeoutId = null;
        }, CONFIG.TOAST_DISPLAY_DURATION);
    }
};
