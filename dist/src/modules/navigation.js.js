import { CONFIG, URL_GROUPS, STORAGE_KEYS } from "/src/config.js.js";
import { State } from "/src/state.js.js";
import { Toast } from "/src/utils/toast.js.js";

export const URLNavigator = {
    urls: null,
    currentIndex: -1,

    init(currentUrl) {
        // Determine which URL list to use
        if (URL_GROUPS.SF_BAY.some(url => currentUrl.includes(url))) {
            this.urls = URL_GROUPS.SF_BAY;
        } else if (URL_GROUPS.HAWAII.some(url => currentUrl.includes(url))) {
            this.urls = URL_GROUPS.HAWAII;
        } else {
            console.log('Current URL is not in the list of URLs', currentUrl);
            return false;
        }

        this.currentIndex = this.urls.findIndex(url => currentUrl.includes(url));

        if (this.currentIndex === -1) {
            console.log('Could not find current URL in the list');
            return false;
        }

        return true;
    },

    goToNext() {
        console.log('Navigating to next page');
        const nextIndex = (this.currentIndex + 1) % this.urls.length;
        window.location.href = this.urls[nextIndex];
    },

    goToPrevious() {
        console.log('Navigating to previous page');
        const prevIndex = (this.currentIndex - 1 + this.urls.length) % this.urls.length;
        window.location.href = this.urls[prevIndex];
    }
};

export const AutoNavigation = {
    start() {
        if (!State.autoNavigationEnabled || State.pageRotationTimeoutId) {
            return;
        }

        State.pageRotationTimeoutId = setTimeout(() => {
            console.log('Navigating to next page after delay');
            URLNavigator.goToNext();
        }, CONFIG.PAGE_ROTATION_DELAY);

        console.log('Auto navigation enabled');
    },

    stop() {
        if (State.pageRotationTimeoutId) {
            clearTimeout(State.pageRotationTimeoutId);
            State.pageRotationTimeoutId = null;
        }
        console.log('Auto navigation disabled');
    },

    scheduleRefresh() {
        if (State.refreshTimeoutId) {
            clearTimeout(State.refreshTimeoutId);
        }

        State.refreshTimeoutId = setTimeout(() => {
            window.location.reload();
        }, CONFIG.DISABLED_PAGE_REFRESH_DELAY);
    },

    cancelRefresh() {
        if (State.refreshTimeoutId) {
            clearTimeout(State.refreshTimeoutId);
            State.refreshTimeoutId = null;
        }
    },

    loadState() {
        try {
            const storedValue = localStorage.getItem(STORAGE_KEYS.AUTO_NAV_ENABLED);
            if (storedValue === 'false') {
                State.autoNavigationEnabled = false;
                this.scheduleRefresh();
            }
        } catch (error) {
            console.error('Error loading auto navigation state', error);
        }
    },

    persistState() {
        try {
            localStorage.setItem(STORAGE_KEYS.AUTO_NAV_ENABLED, String(State.autoNavigationEnabled));
        } catch (error) {
            console.error('Error saving auto navigation state', error);
        }
    },

    toggle() {
        State.autoNavigationEnabled = !State.autoNavigationEnabled;
        this.persistState();

        if (State.autoNavigationEnabled) {
            this.start();
            Toast.show('Auto navigation on');
            this.cancelRefresh();
        } else {
            this.stop();
            Toast.show('Auto navigation off');
            this.scheduleRefresh();
        }
    }
};
