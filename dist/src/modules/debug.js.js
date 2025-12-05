import __vite__cjsImport0_jquery from "/vendor/.vite-deps-jquery.js__v--1828ac88.js"; const $ = __vite__cjsImport0_jquery.__esModule ? __vite__cjsImport0_jquery.default : __vite__cjsImport0_jquery;
import { CONFIG } from "/src/config.js.js";
import { Toast } from "/src/utils/toast.js.js";

export const DebugHandler = {
    run() {
        const $video = $('video');
        if ($video.length === 0) return;

        if (CONFIG.DEBUG) {
            const videoEl = $video[0];
            // Wait for metadata if dimensions are 0
            if (videoEl.readyState >= 1) {
                const width = videoEl.videoWidth;
                const height = videoEl.videoHeight;
                const ratio = width / height;
                console.log('--- VIDEO DIMENSIONS ---');
                console.log(`Intrinsic Width: ${width}px`);
                console.log(`Intrinsic Height: ${height}px`);
                console.log(`Aspect Ratio: ${ratio.toFixed(4)}`);
                console.log('------------------------');
            } else {
                console.log('Video metadata not yet loaded');
                videoEl.addEventListener('loadedmetadata', () => {
                    console.log('--- VIDEO DIMENSIONS (Delayed) ---');
                    console.log(`Intrinsic Width: ${videoEl.videoWidth}px`);
                    console.log(`Intrinsic Height: ${videoEl.videoHeight}px`);
                    console.log(`Aspect Ratio: ${videoEl.videoWidth / videoEl.videoHeight}`);
                });
            }

            $video.css({
                'border': '5px solid blue'
            });
        } else {
            $video.css({
                'border': ''
            });
        }
    },

    toggle() {
        CONFIG.DEBUG = !CONFIG.DEBUG;
        console.log(`Debug mode: ${CONFIG.DEBUG ? 'ON' : 'OFF'}`);
        this.run();
        Toast.show(`Debug: ${CONFIG.DEBUG ? 'ON' : 'OFF'}`);
    }
};
