let latestFullscreenButton = null;
let userGestureCaptured = false;
let checkIntervalId = null;
let stopCheckTimeoutId = null;

function attemptFullscreenTrigger() {
  if (!userGestureCaptured || !latestFullscreenButton) {
    return;
  }

  console.log('Attempting to enter fullscreen via user gesture...');
  latestFullscreenButton.trigger('click');
  teardownListeners();
}

function handleUserGesture() {
  userGestureCaptured = true;
  attemptFullscreenTrigger();
}

function setupUserGestureListeners() {
  // Capture the first real user action (click or key press) so fullscreen is gesture-initiated.
  document.addEventListener('click', handleUserGesture, { once: true, capture: true });
  document.addEventListener('keydown', handleUserGesture, { once: true, capture: true });


}

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
  videoPlayerWrapper = $('.CamPlayerKbygRewinds_playerWrapper__bWm7U');
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
    const $fullscreenButton = $('button.FullscreenControl_fullscreenControl__2Rv8C');

    if ($fullscreenButton.length > 0) {
      latestFullscreenButton = $fullscreenButton;
      console.log('Found fullscreen button, waiting for user gesture to trigger...');
      customCode()
      attemptFullscreenTrigger();
    }
  }, 500);

  // Stop checking after 10 seconds
  stopCheckTimeoutId = setTimeout(() => {
    teardownListeners();
    console.log('Stopped looking for fullscreen button');
  }, 10000);
}

// Execute when jQuery and DOM are ready
$(function() {
  setupUserGestureListeners();
  waitForFullscreenButton();
});
