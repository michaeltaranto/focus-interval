/* istanbul ignore next: window not defined in test context, e.g. node */
export default function focusInterval(fn, interval, el, context = window) {
  const now = () => new context.Date();
  let timeLastRun = now();
  let timer;

  const stop = () => {
    if (timer) {
      context.clearTimeout(timer);
    }
  };

  const start = time => {
    stop();
    timer = context.setTimeout(run, (time || interval)); // eslint-disable-line no-use-before-define
  };

  const run = () => {
    timeLastRun = now();
    fn();
    start();
  };

  const focus = () => {
    const timeFocused = now();
    const timeSinceLastRun = timeFocused - timeLastRun;

    if (timeSinceLastRun >= interval) {
      run();
    } else {
      start(interval - timeSinceLastRun);
    }
  };

  el.addEventListener('blur', stop);

  el.addEventListener('focus', focus);

  return () => {
    stop();
    el.removeEventListener('focus', focus);
  };
}
