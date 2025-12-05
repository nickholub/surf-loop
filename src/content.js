import $ from 'jquery';
import { URLNavigator, AutoNavigation } from './modules/navigation.js';
import { FullscreenButtonDetector } from './modules/fullscreen.js';
import { KeyboardHandler } from './modules/keyboard.js';

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
