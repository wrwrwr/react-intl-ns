import {createElement} from 'react';
import {FormattedHTMLMessage, FormattedMessage,
        FormattedNumber} from 'react-intl';

import {separator} from './main';


/**
 * Returns shortcuts bound to a namespace, either producing Formatted* elements
 * or string promises.
 *
 * May also be called without a namespace, returning simple abbreviations for
 * Formatted* elements and format* methods.
 */
export function intlShortcuts(namespace) {
    return {
        t: intlMessageShortcut(FormattedMessage)(namespace),
        ts: intlMessageStringShortcut('formatMessage')(namespace),
        h: intlMessageShortcut(FormattedHTMLMessage)(namespace),
        hs: intlMessageStringShortcut('formatHTMLMessage')(namespace),
        n: intlNumberShortcut(FormattedNumber)(namespace),
        ns: intlNumberStringShortcut('formatNumber')(namespace)
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
 * Delays execution of func(intl) until a cast to a string is made.
 */
class StringPromise {
    constructor(intl, func) {
        this.intl = intl;
        this.func = func;
    }

    toString() {
        return this.func(this.intl);
    }
}


/**
 * Creates a direct string formatter shortcut, to be used with @injectIntl.
 *
 * The factory is created for a given (name of) a format* method. It can then
 * generate a shortcuts bound to a namespace. Such a shortcut can be used as a
 * function or a template tag, similarly to the non-string version, but instead
 * of returning a React element it gives a function taking as the only argument
 * the intl object and returning a plain string.
 */
export function intlMessageStringShortcut(method) {
    return namespace => {
        let prefix = prefixer(namespace);
        return (...args) => {
            let {id, values} = maybeEvaluateTemplate(args);
            let descriptor = {id: prefix(id), defaultMessage: id};
            return intl => new StringPromise(
                    intl,
                    validIntl => validIntl[method](descriptor, values)
            );
        };
    };
}


/**
 * Creates a direct number formatter shortcut.
 */
export function intlNumberStringShortcut(method) {
    return namespace => {
        let prefix = prefixer(namespace);
        return (format, value) => {
            if (value === undefined) {
                return intl => new StringPromise(
                        intl,
                        validIntl => validIntl[method](format)
                );
            } else {
                format = prefix(format);
                return intl => new StringPromise(
                        intl,
                        validIntl => validIntl[method](value, {format})
                );
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
