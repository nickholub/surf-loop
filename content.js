// ============================================================================
// CONFIGURATION
// ============================================================================
const CONFIG = {
  PAGE_ROTATION_DELAY: 3 * 60 * 1000,
  // PAGE_ROTATION_DELAY: 10 * 1000, // 10 seconds, dev testing
  FULLSCREEN_BUTTON_WAIT_TIMEOUT: 60 * 1000,
  FULLSCREEN_BUTTON_CHECK_INTERVAL: 500,
  TOAST_DISPLAY_DURATION: 2000,
  DISABLED_PAGE_REFRESH_DELAY: 10 * 60 * 1000,

  OVERLAY_STYLES: {
    'position': 'fixed',
    'top': '0',
    'left': '0',
    'width': '100%',
    'height': '100%',
    'z-index': '2147483647'
  },

  VIDEO_WRAPPER_STYLES: {
    'width': '100%',
    'height': '100%'
  },

  TOAST_STYLES: {
    'position': 'fixed',
    'left': '50%',
    'top': '24px',
    'transform': 'translateX(-50%)',
    'background': '#0f172a',
    'color': '#f8fafc',
    'padding': '14px 18px',
    'border-radius': '12px',
    'box-shadow': '0 4px 16px rgba(0, 0, 0, 0.25)',
    'font-family': 'Arial, sans-serif',
    'font-size': '16px',
    'opacity': '0',
    'transition': 'opacity 150ms ease-in-out',
    'pointer-events': 'none',
    'z-index': '2147483648'
  },

  SELECTORS: {
    VIDEO_PLAYER_WRAPPER: 'div[class*="CamPlayerKbygRewinds_playerWrapper"]',
    FULLSCREEN_BUTTON: 'button[class*="FullscreenControl_fullscreenControl"]',
    VIDEO_OVERLAY: '#video-overlay'
  }
};

const STORAGE_KEYS = {
  AUTO_NAV_ENABLED: 'surfline-auto-navigation-enabled'
};

const URL_GROUPS = {
  SF_BAY: [
    "https://www.surfline.com/surf-report/linda-mar-north/5cbf8d85e7b15800014909e8?camId=58349ea8e411dc743a5d52c7",
    "https://www.surfline.com/surf-report/pleasure-point/5842041f4e65fad6a7708807?camId=5cf0124c4f41df57b971a9a4",
    "https://www.surfline.com/surf-report/cowells/5842041f4e65fad6a7708806?camId=583497a03421b20545c4b532",
    "https://www.surfline.com/surf-report/steamer-lane/5842041f4e65fad6a7708805?camId=63726f8a5cd4988578c5179b",
    "https://www.surfline.com/surf-report/maverick-s/5842041f4e65fad6a7708801?camId=60957ad32272016445d45b2c",
    "https://www.surfline.com/surf-report/half-moon-bay/5842041f4e65fad6a770896f"
  ],

  HAWAII: [
    "https://www.surfline.com/surf-report/pipeline/5842041f4e65fad6a7708890?camId=58349ef6e411dc743a5d52cc",
    "https://www.surfline.com/surf-report/waikiki-beach/584204204e65fad6a7709148?camId=5d24cc0b3ea3012c99da7808",
    "https://www.surfline.com/surf-report/laniakea/5842041f4e65fad6a7708898?camId=58349bb9e411dc743a5d52a6",
    "https://www.surfline.com/surf-report/honolua-bay/5842041f4e65fad6a7708897?camId=58349946e411dc743a5d52b0"
  ]
};

// ============================================================================
// STATE MANAGEMENT
// ============================================================================
const State = {
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

// ============================================================================
// TOAST MODULE
// ============================================================================
const Toast = {
  $el: null,

  ensureElement() {
    if (this.$el) return;
    this.$el = $('<div id="surfline-toast"></div>');
    this.$el.css(CONFIG.TOAST_STYLES);
    $('body').append(this.$el);
  },

  show(message) {
    this.ensureElement();
    this.$el.text(message);
    this.$el.css('opacity', '1');

    if (State.toastTimeoutId) {
      clearTimeout(State.toastTimeoutId);
    }

    State.toastTimeoutId = setTimeout(() => {
      this.$el.css('opacity', '0');
      State.toastTimeoutId = null;
    }, CONFIG.TOAST_DISPLAY_DURATION);
  }
};

// ============================================================================
// VIDEO OVERLAY MODULE
// ============================================================================
const VideoOverlay = {
  create() {
    console.log('makeVideoFullScreen');

    try {
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

// ============================================================================
// FULLSCREEN BUTTON DETECTOR
// ============================================================================
const FullscreenButtonDetector = {
  start() {
    console.log('Waiting for fullscreen button...');

    State.checkIntervalId = setInterval(() => {
      const $button = $(CONFIG.SELECTORS.FULLSCREEN_BUTTON);

      if ($button.length > 0) {
        console.log('Found fullscreen button', $button);
        this.stop();
        VideoOverlay.create();
      }
    }, CONFIG.FULLSCREEN_BUTTON_CHECK_INTERVAL);

    State.stopCheckTimeoutId = setTimeout(() => {
      this.stop();
      console.log('Stopped looking for fullscreen button');
    }, CONFIG.FULLSCREEN_BUTTON_WAIT_TIMEOUT);
  },

  stop() {
    if (State.checkIntervalId) {
      clearInterval(State.checkIntervalId);
      State.checkIntervalId = null;
    }
    if (State.stopCheckTimeoutId) {
      clearTimeout(State.stopCheckTimeoutId);
      State.stopCheckTimeoutId = null;
    }
  }
};

// ============================================================================
// URL NAVIGATION MODULE
// ============================================================================
const URLNavigator = {
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

// ============================================================================
// AUTO NAVIGATION MODULE
// ============================================================================
const AutoNavigation = {
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

// ============================================================================
// KEYBOARD HANDLER MODULE
// ============================================================================
const KeyboardHandler = {
  init() {
    $(document).on('keydown', (e) => {
      switch(e.key) {
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
      }
    });
  }
};

// ============================================================================
// MAIN INITIALIZATION
// ============================================================================
console.log('global init');

$(function() {
  console.log('jQuery and DOM are ready');

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
