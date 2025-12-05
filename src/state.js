export const State = {
    checkIntervalId: null,
    stopCheckTimeoutId: null,
    pageRotationTimeoutId: null,
    videoWrapper: null,
    videoPlayerWrapper: null,
    originalParent: null,
    originalIndex: null,
    autoNavigationEnabled: true,
    toastTimeoutId: null,
    refreshTimeoutId: null,

    clear() {
        if (this.checkIntervalId) {
            clearInterval(this.checkIntervalId);
            this.checkIntervalId = null;
        }
        if (this.stopCheckTimeoutId) {
            clearTimeout(this.stopCheckTimeoutId);
            this.stopCheckTimeoutId = null;
        }
        if (this.pageRotationTimeoutId) {
            clearTimeout(this.pageRotationTimeoutId);
            this.pageRotationTimeoutId = null;
        }

        if (this.toastTimeoutId) {
            clearTimeout(this.toastTimeoutId);
            this.toastTimeoutId = null;
        }
    }
};
