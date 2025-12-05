import __vite__cjsImport0_jquery from "/vendor/.vite-deps-jquery.js__v--1828ac88.js"; const $ = __vite__cjsImport0_jquery.__esModule ? __vite__cjsImport0_jquery.default : __vite__cjsImport0_jquery;
import { VideoOverlay } from "/src/modules/overlay.js.js";
import { URLNavigator, AutoNavigation } from "/src/modules/navigation.js.js";
import { DebugHandler } from "/src/modules/debug.js.js";

export const KeyboardHandler = {
    init() {
        $(document).on('keydown', (e) => {
            switch (e.key) {
                case 'Escape':
                    VideoOverlay.remove();
                    break;
                case 'ArrowLeft':
                    URLNavigator.goToPrevious();
                    break;
                case 'ArrowRight':
                    URLNavigator.goToNext();
                    break;
                case 's':
                case 'S':
                    AutoNavigation.toggle();
                    break;
                case 'd':
                case 'D':
                    DebugHandler.toggle();
                    break;
            }
        });
    }
};
