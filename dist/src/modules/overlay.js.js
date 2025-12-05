import __vite__cjsImport0_jquery from "/vendor/.vite-deps-jquery.js__v--1828ac88.js"; const $ = __vite__cjsImport0_jquery.__esModule ? __vite__cjsImport0_jquery.default : __vite__cjsImport0_jquery;
import { CONFIG } from "/src/config.js.js";
import { State } from "/src/state.js.js";
import { DebugHandler } from "/src/modules/debug.js.js";

export const VideoOverlay = {
    create() {
        console.log('makeVideoFullScreen');

        try {
            DebugHandler.run();

            State.videoPlayerWrapper = $(CONFIG.SELECTORS.VIDEO_PLAYER_WRAPPER);

            if (State.videoPlayerWrapper.length === 0) {
                console.log('Video player wrapper not found');
                return;
            }

            State.videoWrapper = State.videoPlayerWrapper.children('div').eq(1);

            if (State.videoWrapper.length === 0) {
                console.log('Video wrapper not found');
                return;
            }

            console.log('videoWrapper', State.videoWrapper);

            // Save original parent and position
            State.originalParent = State.videoWrapper.parent();
            State.originalIndex = State.originalParent.children().index(State.videoWrapper);

            // Create overlay container
            const $overlay = $('<div id="video-overlay"></div>');
            Object.assign($overlay[0].style, CONFIG.OVERLAY_STYLES); // Using Object.assign for styles if passed as object, or .css() if using jquery

            // Since we are using jQuery for everything else, let's stick to it for consistency or fix the mixed usage.
            // The original code used $overlay.css(CONFIG.OVERLAY_STYLES).
            // Let's stick to jQuery for now as per the plan to just split files first.
            $overlay.css(CONFIG.OVERLAY_STYLES);

            // Move video wrapper into overlay
            $overlay.append(State.videoWrapper);
            $('body').append($overlay);

            // Style the video wrapper
            State.videoWrapper.css(CONFIG.VIDEO_WRAPPER_STYLES);
        } catch (error) {
            console.error('Error in VideoOverlay.create:', error);
        }
    },

    remove() {
        console.log('Removing overlay and restoring video wrapper...');

        State.clear();

        const $overlay = $(CONFIG.SELECTORS.VIDEO_OVERLAY);
        if ($overlay.length > 0 && State.originalParent && State.videoWrapper) {
            // Remove custom styles
            State.videoWrapper.css({ 'width': '', 'height': '' });

            // Restore to original position
            if (State.originalIndex !== null && State.originalIndex < State.originalParent.children().length) {
                State.videoWrapper.insertBefore(State.originalParent.children().eq(State.originalIndex));
            } else {
                State.originalParent.append(State.videoWrapper);
            }

            // Remove the overlay
            $overlay.remove();
            console.log('Video wrapper restored to original position');
        }
    }
};
