import $ from 'jquery';
import { URLNavigator, AutoNavigation } from './modules/navigation.js';
import { FullscreenButtonDetector } from './modules/fullscreen.js';
import { KeyboardHandler } from './modules/keyboard.js';

console.log('global init');

async function initialize() {
    console.log('DOM ready 2');

    const currentUrl = window.location.href;

    // Initialize URL navigator (now async)
    const initialized = await URLNavigator.init(currentUrl);
    if (!initialized) {
        return;
    }

    // Start modules
    await AutoNavigation.loadState();
    FullscreenButtonDetector.start();
    KeyboardHandler.init();
    await AutoNavigation.start();
}

$(function () {
    initialize();
});
