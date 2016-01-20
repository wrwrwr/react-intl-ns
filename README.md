react-intl-ns
=============

Intl namespaces and shortcuts for components that hold their own translations.

Example
-------

```js
// app.jsx

import React, {Component} from 'react';
import {IntlNsProvider, intlShortcuts} from 'react-intl-ns';
import Comp from './comp';

const {t} = intlShortcuts();
const messages = {title: "app title"};

class App extends Component {
    render() {
        return  <IntlNsProvider locale='en' messages={messages}>
                    <div>
                        {t`title`}
                        <Comp />
                    </div>
                </IntlNsProvider>;
    }
}

// comp.jsx

import React, {Component} from 'react';
import {IntlNamespace, intlShortcuts} from 'react-intl-ns';

const {t} = intlShortcuts('comp');
const messages = {en: {title: "comp title"}};

export default class Comp extends Component {
    render() {
        return  <IntlNamespace namespace='comp' messages={messages}>
                    {t`title`}
                </IntlNamespace>;
    }
}
```

The `t` shortcut inserts a `<FormattedMessage>` with id prefixed by a namespace.
`<IntlNamespace>` injects messages and formats into `context.intl.namespaces`.
The extended provider detects prefixed ids and substitutes messages and formats
from the proper namespace.

Shortcuts
---------

Three shortcuts are available out-of-the-box:

* `t` inserts a `<FormattedMessage>` element,
* `h` a `<FormattedHTMLMessage>`,
* and `n` a `<FormattedNumber>`.

First two can be used as a template tag or a function, for example both
``t`id` `` and `t('id')` do the same. In the first form the template is
actually evaluated:

```js
let i = 5;
t`id${i}`
```

will insert message with `id5`. Values can be given as a second argument, using
the function call syntax:

```js
t('id', {photos: 22})
```

The `defaultMessage` prop is set to the first shortcut argument:

```js
t`This is a message.`
```

The last form is handy for early prototyping, with messages declared in-place.

Formats
-------

You may also provide component-specific formats using
`<IntlNamespace formats={...}>`.

These can be used within namespaced messages:

```js
const messages = {en: {freq: "Frequency: {f, number, frequency}"};
const formats = {number: {frequency: {style: 'percent'}}};

t('freq', {f: 0.5});
```

or directly using the `n` shortcut:

```js
n('frequency', 0.5)
```

Shortcut factories
------------------

Two helpers are available for modules that would like to provide shortcuts for
namespaced version of custom components.

If the component extends `FormattedMessage` use `intlMessageShortcut` factory:

```js
class CustomMessage extends FormattedMessage {}

import {intlMessageShortcut} from 'react-intl-ns';
export const cm = intlMessageShortcut(CustomMessage);
```

If it is similar to `FormattedNumber` use `intlNumberShortcut` instead:

```js
class CustomNumber extends FormattedNumber {}

import {intlNumberShortcut} from 'react-intl-ns';
export const cn = intlNumberShortcut(CustomNumber);
```

Installation and usage
----------------------

```bash
npm install react react-intl@2.0.0-beta-2 react-intl-ns
```

### Bundler and transpiler

Import `main.jsx` from the module:

```js
import * from 'react-intl-ns/main.jsx';
```

and ensure it is passed through a transpiler. For instance, with Webpack and
Babel add a loader such as:

```js
test: /\.jsx$/,
include: 'react-intl-ns',
loader: 'babel',
query: {presets: ['es2015', 'stage-0', 'react']}
```

### Without a transpiler

Require `react`, `react-intl`, and `react-intl-ns`:

```js
var React = require('react');
var ReactIntl = require('react-intl');
var ReactIntlNs = require('react-intl-ns');
```

You may also require a bundle for a specific standard edition by appending
`/dist/main.es5.js` (ES5 is the default, and the only option, unless you are
reading this in the future).

### Without a bundler

So you have a project that needs translations namespacing, but doesn't use a
bundler. Nevertheless, add at least the following scripts to your page:

```html
<script src="node_modules/react/dist/react.js"></script>
<script src="node_modules/react-intl/dist/react-intl.js"></script>
<script src="node_modules/react-intl-ns/dist/main.es5.js"></script>
```

or take a look at a [minimal example](tests/browser.html).
