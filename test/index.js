import focusInterval from '../src';
import { spy } from 'sinon';
import mkdom from 'mkdom';
import { expect } from 'chai';

const INTERVAL = 40;
const element = mkdom('<input />');

describe('Given a function', () => {
  describe('When a focus interval is set', () => {
    const handler = spy();

    before(() => focusInterval(handler, INTERVAL, element));

    after(() => handler.reset());

    it('Then the function should not have been fired', () => {
      expect(handler.callCount).to.equal(0);
    });
  });
});

describe('Given a focus interval is set', () => {
  describe('When the user focuses the element,', () => {
    describe('and the time since the function was last run does not exceed the interval', () => {
      const handler = spy();

      before(() => focusInterval(handler, INTERVAL, element));

      after(() => handler.reset());

      it('Then the function should not be fired', () => {
        expect(handler.callCount).to.equal(0);
      });

      it('Then the function should be fired after the interval time elapses');
    });

    describe.skip('and the time since the function was last run exceeds the interval', () => {
      const handler = spy();

      before(() => focusInterval(handler, INTERVAL, element));

      after(() => handler.reset());

      it('Then the function should be fired immediately', () => {
        expect(handler.callCount).to.equal(1);
      });
    });
  });
});

describe('Given a focus interval is set', () => {
  describe('and the user has focused the element', () => {
    describe('When the user blurs the element', () => {
      it('Then the function should no longer fire on the interval');
    });
  });
});
