// Constants
const PAGE_ROTATION_DELAY = 3 * 60 * 1000;
// const PAGE_ROTATION_DELAY = 10 * 1000; // 10 seconds, dev testing
const FULLSCREEN_BUTTON_WAIT_TIMEOUT = 60 * 1000; // 60 seconds
const urlsSFBay = [
  "https://www.surfline.com/surf-report/linda-mar-north/5cbf8d85e7b15800014909e8?camId=58349ea8e411dc743a5d52c7",
  "https://www.surfline.com/surf-report/cowells/5842041f4e65fad6a7708806?camId=583497a03421b20545c4b532",
  "https://www.surfline.com/surf-report/steamer-lane/5842041f4e65fad6a7708805?camId=63726f8a5cd4988578c5179b",
  "https://www.surfline.com/surf-report/maverick-s/5842041f4e65fad6a7708801?camId=60957ad32272016445d45b2c",
  "https://www.surfline.com/surf-report/half-moon-bay/5842041f4e65fad6a770896f"
];

const urlsHawaii = [
  "https://www.surfline.com/surf-report/pipeline/5842041f4e65fad6a7708890?camId=58349ef6e411dc743a5d52cc",
  "https://www.surfline.com/surf-report/waikiki-beach/584204204e65fad6a7709148?camId=5d24cc0b3ea3012c99da7808",
  "https://www.surfline.com/surf-report/laniakea/5842041f4e65fad6a7708898?camId=58349bb9e411dc743a5d52a6",
  "https://www.surfline.com/surf-report/honolua-bay/5842041f4e65fad6a7708897?camId=58349946e411dc743a5d52b0"
];

let latestFullscreenButton = null;
let userGestureCaptured = false;
let checkIntervalId = null;
let stopCheckTimeoutId = null;
let pageRotationTimeoutId = null;
let videoWrapper = null;
let videoPlayerWrapper = null;
let originalParent = null;
let originalIndex = null;

function teardownListeners() {
  if (checkIntervalId) {
    clearInterval(checkIntervalId);
    checkIntervalId = null;
  }

  if (stopCheckTimeoutId) {
    clearTimeout(stopCheckTimeoutId);
    stopCheckTimeoutId = null;
  }
}

function removeOverlay() {
  console.log('Removing overlay and restoring video wrapper...');

  // Clear all timeouts and intervals
  teardownListeners();

  const $overlay = $('#video-overlay');
  if ($overlay.length > 0 && originalParent && videoWrapper) {
    // Remove custom styles from video wrapper
    videoWrapper.css({
      'width': '',
      'height': ''
    });

    // Restore to original position
    if (originalIndex !== null && originalIndex < originalParent.children().length) {
      videoWrapper.insertBefore(originalParent.children().eq(originalIndex));
    } else {
      originalParent.append(videoWrapper);
    }

    // Remove the overlay
    $overlay.remove();
    console.log('Video wrapper restored to original position');
  }
}

function customCode() {
  console.log('customCode')
  videoPlayerWrapper = $('div[class*="CamPlayerKbygRewinds_playerWrapper"]');
  videoWrapper = videoPlayerWrapper.children('div').eq(1);

  console.log('videoWrapper');
  console.log(videoWrapper);

  // Save original parent and position
  originalParent = videoWrapper.parent();
  originalIndex = originalParent.children().index(videoWrapper);

  // Create overlay container
  const $overlay = $('<div id="video-overlay"></div>');
  $overlay.css({
    'position': 'fixed',
    'top': '0',
    'left': '0',
    'width': '100%',
    'height': '100%',
    'z-index': '2147483647',
    //'background': 'black'
  });

  // Move video wrapper into overlay
  $overlay.append(videoWrapper);
  $('body').append($overlay);

  // Style the video wrapper
  videoWrapper.css({
    'width': '100%',
    'height': '100%'
  });
}

function waitForFullscreenButton() {
  console.log('Waiting for fullscreen button with jQuery...');

  // Check every 500ms for the button
  checkIntervalId = setInterval(() => {
    const $fullscreenButton = $('button[class*="FullscreenControl_fullscreenControl"]');

    if ($fullscreenButton.length > 0) {
      console.log('Found fullscreen button', $fullscreenButton);
      teardownListeners();
      customCode()
    }
  }, 500);

  // Stop checking after timeout
  stopCheckTimeoutId = setTimeout(() => {
    teardownListeners();
    console.log('Stopped looking for fullscreen button');
  }, FULLSCREEN_BUTTON_WAIT_TIMEOUT);
}

console.log('global init');

// Execute when jQuery and DOM are ready
$(function() {
  console.log('jQuery and DOM are ready');

  var urls;
  const currentUrl = window.location.href;
  if (urlsSFBay.includes(currentUrl)) {
    urls = urlsSFBay;
  } else if (urlsHawaii.includes(currentUrl)) {
    urls = urlsHawaii;
  } else {
    console.log('Current URL is not in the list of URLs', currentUrl);
    return;
  }

  waitForFullscreenButton();

  // Listen for keyboard events
  $(document).on('keydown', function(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      removeOverlay();
    } else if (e.key === 'ArrowLeft') {
      // Navigate to previous page
      console.log('Navigating to previous page');
      const currentIndex = urls.findIndex(url => currentUrl.includes(url));
      const prevIndex = (currentIndex - 1 + urls.length) % urls.length;
      window.location.href = urls[prevIndex];
    } else if (e.key === 'ArrowRight') {
      // Navigate to next page
      console.log('Navigating to next page');
      const currentIndex = urls.findIndex(url => currentUrl.includes(url));
      const nextIndex = (currentIndex + 1) % urls.length;
      window.location.href = urls[nextIndex];
    }
  });

  // Navigate to next page after delay
  pageRotationTimeoutId = setTimeout(function() {
    console.log('Navigating to next page after delay');
    const currentIndex = urls.findIndex(url => currentUrl.includes(url));
    const nextIndex = (currentIndex + 1) % urls.length;

    window.location.href = urls[nextIndex];
  }, PAGE_ROTATION_DELAY);
});
