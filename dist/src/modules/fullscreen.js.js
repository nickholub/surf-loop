import __vite__cjsImport0_jquery from "/vendor/.vite-deps-jquery.js__v--1828ac88.js"; const $ = __vite__cjsImport0_jquery.__esModule ? __vite__cjsImport0_jquery.default : __vite__cjsImport0_jquery;
import { CONFIG } from "/src/config.js.js";
import { State } from "/src/state.js.js";
import { VideoOverlay } from "/src/modules/overlay.js.js";

export const FullscreenButtonDetector = {
    start() {
        console.log('Waiting for fullscreen button...');

        State.checkIntervalId = setInterval(() => {
            const $button = $(CONFIG.SELECTORS.FULLSCREEN_BUTTON);

            if ($button.length > 0) {
                console.log('Found fullscreen button', $button);
                this.stop();
                VideoOverlay.create();
            }
        }, CONFIG.FULLSCREEN_BUTTON_CHECK_INTERVAL);

        State.stopCheckTimeoutId = setTimeout(() => {
            this.stop();
            console.log('Stopped looking for fullscreen button');
        }, CONFIG.FULLSCREEN_BUTTON_WAIT_TIMEOUT);
    },

    stop() {
        if (State.checkIntervalId) {
            clearInterval(State.checkIntervalId);
            State.checkIntervalId = null;
        }
        if (State.stopCheckTimeoutId) {
            clearTimeout(State.stopCheckTimeoutId);
            State.stopCheckTimeoutId = null;
        }
    }
};
