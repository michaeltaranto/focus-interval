import focusInterval from '../src';
import jsdom from 'jsdom';
import { expect } from 'chai';
import lolex from 'lolex';

const INTERVAL = 40;
const document = jsdom.jsdom(`
  <!doctype html>
  <html>
    <body>
      <input id="testInput" />
    </body>
  </html>
`);
const element = document.getElementById('testInput');
const FOCUS_EVENT = document.createEvent('HTMLEvents');
FOCUS_EVENT.initEvent('focus', false, true);
const BLUR_EVENT = document.createEvent('HTMLEvents');
BLUR_EVENT.initEvent('blur', false, true);

describe('Given a function', () => {
  describe('When a focus interval is set', () => {
    let count = 0;
    let stopInterval;

    const handler = () => count++;

    before(() => {
      stopInterval = focusInterval(handler, INTERVAL, element, global); // eslint-disable-line no-undef
    });

    after(() => stopInterval());

    it('Then the function should not have been fired', () => (
      expect(count).to.equal(0)
    ));
  });
});

describe('Given a focus interval is set', () => {
  describe('When the user focuses the element,', () => {
    describe('the function should fire on the interval', () => {
      let count = 0;
      let stopInterval;

      const clock = lolex.createClock();
      const handler = () => count++;

      before(() => {
        stopInterval = focusInterval(handler, INTERVAL, element, clock); // Set interval
        element.dispatchEvent(FOCUS_EVENT); // Focus element
      });

      after(() => {
        stopInterval();
        clock.reset();
      });

      it('Then the function should be fired on interval', () => {
        clock.tick(INTERVAL);
        expect(count).to.equal(1);
        clock.tick(INTERVAL);
        expect(count).to.equal(2);
        clock.tick(INTERVAL);
        expect(count).to.equal(3);
      });
    });

    describe('and the time since the function was last run does not exceed the interval', () => {
      let count = 0;
      let stopInterval;

      const clock = lolex.createClock();
      const handler = () => count++;

      before(() => {
        stopInterval = focusInterval(handler, INTERVAL, element, clock); // Set interval
        element.dispatchEvent(FOCUS_EVENT);               // Focus element
        clock.tick(INTERVAL - 1);                         // Wind clock less than interval
      });

      after(() => {
        stopInterval();
        clock.reset();
      });

      it('Then the function should not be fired', () => (
        expect(count).to.equal(0)
      ));
    });

    describe('and the time since the function was last run exceeds the interval', () => {
      let count = 0;
      let stopInterval;

      const clock = lolex.createClock();
      const handler = () => count++;

      before(() => { // Setup
        stopInterval = focusInterval(handler, INTERVAL, element, clock); // Set interval
        element.dispatchEvent(FOCUS_EVENT);               // Focus element initially
        clock.tick(INTERVAL);                             // Force interval to pass
        element.dispatchEvent(BLUR_EVENT);                // Blur element
      });

      before(() => { // Test
        count = 0;                                        // Reset call count
        clock.tick(INTERVAL);                             // Force interval to pass
        element.dispatchEvent(FOCUS_EVENT);               // Focus element again
      });

      after(() => {
        stopInterval();
        clock.reset();
      });

      it('Then the function should be fired immediately', () => (
        expect(count).to.equal(1)
      ));
    });
  });
});

describe('Given a focus interval is set', () => {
  describe('and the user has focused the element', () => {
    describe('When the user blurs the element', () => {
      let count = 0;
      let stopInterval;

      const clock = lolex.createClock();
      const handler = () => count++;

      before(() => {
        stopInterval = focusInterval(handler, INTERVAL, element, clock); // Set interval
        element.dispatchEvent(FOCUS_EVENT);        // Focus element
        element.dispatchEvent(BLUR_EVENT);         // Blur element
        clock.tick(INTERVAL);                      // Force interval to pass
      });

      after(() => {
        stopInterval();
        clock.reset();
      });

      it('Then the function should no longer fire on the interval', () => (
        expect(count).to.equal(0)
      ));
    });
  });
});

describe('Given a focus interval is set', () => {
  describe('and the user has focused the element', () => {
    describe('When the focus interval has been removed', () => {
      let count = 0;
      let stopInterval;

      const clock = lolex.createClock();
      const handler = () => count++;

      before(() => {
        stopInterval = focusInterval(handler, INTERVAL, element, clock); // Set interval
        clock.tick(INTERVAL);                      // Force interval to pass
        stopInterval();                            // Remove interval
        element.dispatchEvent(FOCUS_EVENT);        // Focus element
      });

      after(() => clock.reset());

      it('Then the function should no longer fire on the interval', () => (
        expect(count).to.equal(0)
      ));
    });
  });
});
