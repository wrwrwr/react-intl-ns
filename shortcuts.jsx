import {createElement} from 'react';
import {FormattedHTMLMessage, FormattedMessage,
        FormattedNumber} from 'react-intl';

import {separator} from './main';


/**
 * Returns shortcuts producing Formatted* elements bound to a namespace.
 *
 * May also be called without a namespace, returning simple abbreviations for
 * Formatted* elements.
 */
export function intlShortcuts(namespace) {
    return {
        t: intlMessageShortcut(FormattedMessage)(namespace),
        h: intlMessageShortcut(FormattedHTMLMessage)(namespace),
        n: intlNumberShortcut(FormattedNumber)(namespace)
    };
}


/**
 * Creates a shortcut factory for a FormattedMessage-like component.
 *
 * The factory takes a namespace and creates a shortcut for a components bound
 * to it. The shortcut may be used as a template tag or a function.
 */
export function intlMessageShortcut(component) {
    return namespace => {
        let prefix = prefixer(namespace);
        return (...args) => {
            let {id, values} = maybeEvaluateTemplate(args);
            return createElement(component, {id: prefix(id),
                                             defaultMessage: id,
                                             values});
        };
    };
}


/**
 * Creates a shortcut factory for a FormattedNumber-like component.
 *
 * The factory takes a namespace and creates a shortcut for a component bound
 * to it. The shortcut takes a format (to be namespaced) as the first argument
 * and value as the second.
 */
export function intlNumberShortcut(component) {
    return namespace => {
        let prefix = prefixer(namespace);
        return (format, value) => {
            if (value === undefined) {
                return createElement(component, {value: format});
            } else {
                return createElement(component, {format: prefix(format),
                                                 value});
            }
        };
    };
}


/**
 * Returns a function that prefixes ids with namespace.
 */
function prefixer(namespace) {
    if (namespace) {
        // Prefix ids and keys with the given namespace.
        return key => `${namespace}${separator}${key}`;
    } else {
        // No namespace, match the signatures of the namespaced constructs.
        return key => key;
    }
}


/**
 * Helper to support calling a shortcut as a function or using it as a template
 * tag, for example t('msg') and t`msg` mean the same.
 */
function maybeEvaluateTemplate(args) {
    if (typeof args[0] === 'string') {
        // Direct call (second argument is taken as values).
        return {id: args[0], values: args[1]};
    } else {
        // Template tag (use the default evaluation function).
        return {id: String.raw(...args)};
    }
}
