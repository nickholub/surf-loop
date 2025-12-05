import __vite__cjsImport0_jquery from "/vendor/.vite-deps-jquery.js__v--1828ac88.js"; const $ = __vite__cjsImport0_jquery.__esModule ? __vite__cjsImport0_jquery.default : __vite__cjsImport0_jquery;
import { CONFIG } from "/src/config.js.js";
import { State } from "/src/state.js.js";

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
