// Constants
const PAGE_ROTATION_DELAY = 3 * 60 * 1000;
//const PAGE_ROTATION_DELAY = 10 * 1000; // 10 seconds, dev testing
const FULLSCREEN_BUTTON_WAIT_TIMEOUT = 60 * 1000; // 60 seconds
const urls = [
  "https://www.surfline.com/surf-report/linda-mar-north/5cbf8d85e7b15800014909e8?camId=58349ea8e411dc743a5d52c7",
  "https://www.surfline.com/surf-report/cowells/5842041f4e65fad6a7708806?camId=583497a03421b20545c4b532",
  "https://www.surfline.com/surf-report/steamer-lane/5842041f4e65fad6a7708805?camId=63726f8a5cd4988578c5179b",
  "https://www.surfline.com/surf-report/maverick-s/5842041f4e65fad6a7708801?camId=60957ad32272016445d45b2c",
  "https://www.surfline.com/surf-report/half-moon-bay/5842041f4e65fad6a770896f"
];

let latestFullscreenButton = null;
let userGestureCaptured = false;
let checkIntervalId = null;
let stopCheckTimeoutId = null;

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

function customCode() {
  console.log('customCode')
  videoPlayerWrapper = $('div[class*="CamPlayerKbygRewinds_playerWrapper"]');
  videoWrapper = videoPlayerWrapper.children('div').eq(1);

  console.log('videoWrapper');
  console.log(videoWrapper);

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

// Execute when jQuery and DOM are ready
$(function() {
  waitForFullscreenButton();

  // Navigate to next page after delay
  setTimeout(function() {
    const currentUrl = window.location.href;
    const currentIndex = urls.findIndex(url => currentUrl.includes(url));
    const nextIndex = (currentIndex + 1) % urls.length;

    window.location.href = urls[nextIndex];
  }, PAGE_ROTATION_DELAY);
});
