import { CONFIG } from '../config.js';
import { Storage } from '../storage.js';
import { State } from '../state.js';
import { Toast } from '../utils/toast.js';

export const URLNavigator = {
    urls: null,
    currentIndex: -1,
    currentGroup: null,

    async init(currentUrl) {
        // Load groups from storage
        const groups = await Storage.loadGroups();

        // Find which group the current URL belongs to
        for (const group of groups) {
            const spotIndex = group.spots.findIndex(spot =>
                currentUrl.includes(spot.url.split('?')[0]) ||
                spot.url.includes(currentUrl.split('?')[0])
            );

            if (spotIndex !== -1) {
                this.currentGroup = group;
                this.urls = group.spots.map(spot => spot.url);
                this.currentIndex = spotIndex;
                return true;
            }
        }

        console.log('Current URL is not in any configured group', currentUrl);
        return false;
    },

    goToNext() {
        if (!this.urls) return;
        console.log('Navigating to next page');
        const nextIndex = (this.currentIndex + 1) % this.urls.length;
        window.location.href = this.urls[nextIndex];
    },

    goToPrevious() {
        if (!this.urls) return;
        console.log('Navigating to previous page');
        const prevIndex = (this.currentIndex - 1 + this.urls.length) % this.urls.length;
        window.location.href = this.urls[prevIndex];
    },

    getCurrentSpotName() {
        if (this.currentGroup && this.currentIndex !== -1) {
            return this.currentGroup.spots[this.currentIndex]?.name || null;
        }
        return null;
    },

    getCurrentGroupName() {
        return this.currentGroup?.name || null;
    }
};

export const AutoNavigation = {
    async start() {
        if (!State.autoNavigationEnabled || State.pageRotationTimeoutId) {
            return;
        }

        // Load rotation delay from settings
        const settings = await Storage.loadSettings();
        const delay = settings.rotationDelay || CONFIG.PAGE_ROTATION_DELAY;

        State.pageRotationTimeoutId = setTimeout(() => {
            console.log('Navigating to next page after delay');
            URLNavigator.goToNext();
        }, delay);

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

    async loadState() {
        try {
            // Migrate from localStorage if needed
            await Storage.migrateFromLocalStorage();

            // Load settings from chrome.storage.sync
            const settings = await Storage.loadSettings();
            if (settings.autoNavigationEnabled === false) {
                State.autoNavigationEnabled = false;
                this.scheduleRefresh();
            }
        } catch (error) {
            console.error('Error loading auto navigation state', error);
        }
    },

    async persistState() {
        try {
            const settings = await Storage.loadSettings();
            settings.autoNavigationEnabled = State.autoNavigationEnabled;
            await Storage.saveSettings(settings);
        } catch (error) {
            console.error('Error saving auto navigation state', error);
        }
    },

    async toggle() {
        State.autoNavigationEnabled = !State.autoNavigationEnabled;
        await this.persistState();

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
