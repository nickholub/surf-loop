import $ from 'jquery';
import { VideoOverlay } from './overlay.js';
import { URLNavigator, AutoNavigation } from './navigation.js';
import { DebugHandler } from './debug.js';

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
