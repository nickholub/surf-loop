import __vite__cjsImport0_jquery from "/vendor/.vite-deps-jquery.js__v--1828ac88.js"; const $ = __vite__cjsImport0_jquery.__esModule ? __vite__cjsImport0_jquery.default : __vite__cjsImport0_jquery;
import { URLNavigator, AutoNavigation } from "/src/modules/navigation.js.js";
import { FullscreenButtonDetector } from "/src/modules/fullscreen.js.js";
import { KeyboardHandler } from "/src/modules/keyboard.js.js";

console.log('global init');

$(function () {
    console.log('DOM ready 2');

    const currentUrl = window.location.href;

    // Initialize URL navigator
    if (!URLNavigator.init(currentUrl)) {
        return;
    }

    // Start modules
    AutoNavigation.loadState();
    FullscreenButtonDetector.start();
    KeyboardHandler.init();
    AutoNavigation.start();
});
