import React from 'react';
import {FormattedHTMLMessage, FormattedMessage,
        FormattedNumber} from 'react-intl';

import {separator} from './main';

// Default shortcuts.
const shortcutFactories = {
    t: prefix => (...args) => {
        let {id, values} = maybeEvaluateTemplate(args);
        return <FormattedMessage id={prefix(id)} defaultMessage={id}
                                 values={values} />;
    },
    h: prefix => (...args) => {
        let {id, values} = maybeEvaluateTemplate(args);
        return <FormattedHTMLMessage id={prefix(id)} defaultMessage={id}
                                     values={values} />;
    },
    n: prefix => (format, value) => {
        if (value === undefined) {
            return <FormattedNumber value={format} />;
        } else {
            return <FormattedNumber format={prefix(format)} value={value} />;
        }
    }
};


/**
 * Returns shortcuts producing Formatted* elements bound to a namespace.
 *
 * May also be called without a namespace, returning simple abbreviations for
 * Formatted* elements.
 */
export function intlShortcuts(namespace) {
    let prefix;
    if (namespace) {
        // Prefix ids and keys with the given namespace.
        prefix = key => `${namespace}${separator}${key}`;
    } else {
        // No namespace, match the signatures of the namespaced constructs.
        prefix = key => key;
    }
    // Generate shortcuts for the namespace.
    let shortcuts = {};
    for (let key of Object.keys(shortcutFactories)) {
        shortcuts[key] = shortcutFactories[key](prefix);
    }
    return shortcuts;
}


/**
 * Registers a shortcut to be available through intlShortcuts().
 *
 * Utility for modules that provide some custom intl components and would like
 * to integrate with intl-ns. The factory should take a namespace prefixer and
 * return a shortcut (likely some function).
 */
export function registerIntlShortcut(key, shortcutFactory) {
    shortcutFactories[key] = shortcutFactory;
}


/**
 * Helper to support calling a shortcut as a function or using it as a template
 * tag, for example t('msg') and t`msg` mean the same.
 */
export function maybeEvaluateTemplate(args) {
    if (typeof args[0] === 'string') {
        // Direct call (second argument is taken as values).
        return {id: args[0], values: args[1]};
    } else {
        // Template tag (use the default evaluation function).
        return {id: String.raw(...args)};
    }
}
