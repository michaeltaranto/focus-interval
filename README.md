[![Build Status](https://img.shields.io/travis/mjt01/focus-interval/master.svg?style=flat-square)](https://travis-ci.org/mjt01/focus-interval)
[![Coverage Status](https://img.shields.io/coveralls/mjt01/focus-interval.svg?style=flat-square)](https://coveralls.io/github/mjt01/focus-interval?branch=master)
[![npm](https://img.shields.io/npm/v/focus-interval.svg?style=flat-square)](https://www.npmjs.com/package/focus-interval)
# focus-interval
Run a function on an interval while an element is focused.
```js
$ npm install --save focus-interval
```

### Usage
Executes a function at a defined interval only while an element is focused. When the element recieves focus again:
- if the interval has elapsed, the function will be fired again and a new interval started.
- if the interval has not elapsed, an interval will be set for the remaining time, after which the function will fire and a new interval started, e.g.
    - 10 minute interval
    - 4 minutes pass
    - Element looses focus
    - 2 minutes pass
    - Element receives focus
    - Interval gets set for 4 minutes
    - 4 minutes pass
    - Function fires
    - 10 minute interval begins

##### Setting an interval
```js
focusInterval(<fn>, <ms>, <element>);
```
- **fn**: The function to be fired on interval
- **ms**: The duration of the interval in milliseconds 
- **element**: The DOM node to monitor for focus/blur events


##### Cancelling
`focusInterval` returns a function to remove the event handler from the element and cancels any active intervals.
```js
import focusInterval from 'focus-interval';

const cancelInterval = focusInterval(() => {}, 1000, element);

cancelInterval();
```

### Examples
##### Focus on a field
Save/persist the contents of a `<textarea>` every 3 seconds while the text area is focused 
```js
import focusInterval from 'focus-interval';

const savePost = () => {
  request
    .post('/story/save')
    .send(storyData);
};
const textArea = document.querySelector('textarea');

focusInterval(savePost, 3000, textArea);
```

##### Focus on a window or tab
Refresh your api authentication token every 30 minutes while the `window` is in focus.
```js
import focusInterval from 'focus-interval';

const refreshToken = () => {
  request.get('/token');
};

focusInterval(refreshToken, 30000, window);
```
In this example leaving the `window` (e.g. the browser tab) for a period longer than the interval would mean when you refocus, the `refreshToken` function fires instantly, authenticating or logging them out.

### License

[MIT](http://mjt01.mit-license.org)
