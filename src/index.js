export default function focusInterval(fn, interval, el) {
  let timeLastRun = new Date();
  let timer;

  const stop = () => {
    if (timer) {
      clearTimeout(timer);
    }
  };

  const start = time => {
    stop();
    timer = setTimeout(run, (time || interval)); // eslint-disable-line no-use-before-define
  };

  const run = () => {
    timeLastRun = new Date();
    fn();
    start();
  };

  el.addEventListener('blur', stop);

  el.addEventListener('focus', () => {
    const timeFocused = new Date();
    const timeSinceLastRun = timeFocused - timeLastRun;

    if (timeSinceLastRun > interval) {
      run();
    } else {
      start(interval - timeSinceLastRun);
    }
  });
}
