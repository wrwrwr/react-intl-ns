import React, {Children, Component, PropTypes} from 'react';
import {FormattedHTMLMessage, FormattedMessage, FormattedNumber, IntlProvider,
        intlShape} from 'react-intl';
import {formatMessage, formatNumber} from 'react-intl/lib/format';

// String used to separate namespace prefixes from message and format ids.
const separator = '::';

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
 * Wraps intl.format*() to use namespace messages and formats when appropriate.
 *
 * If a message or format id is prefixed as namespace::id, namespace messages
 * and formats (from intl.namespaces) are used for formatting.
 */
export class IntlNsProvider extends IntlProvider {
    getChildContext() {
        let context = super.getChildContext();
        let intl = context.intl;
        let config = this.getConfig();
        let state = this.state;
        let namespaces = intl.namespaces = {};
        intl.formatMessage = (...args) => {
            let [{id: prefixedId, ...other}, values] = args;
            let [prefix, id] = prefixedId.split(separator);
            let namespace = namespaces[prefix];
            if (id === undefined || !namespace) {
                // The message does not come from a namespace (thus should use
                // the global dictionaries) or there are no messages or formats
                // for the given namespace.
                return formatMessage(config, state, ...args);
            }
            // Possibility: If config.messages contains prefixedId, let it
            //              override the namespace-specific message.
            // Substitute namespace messages and formats into the config.
            let nsConfig = Object.assign({}, config, {
                messages: namespace.messages[intl.locale],
                formats: namespace.formats
            });
            return formatMessage(nsConfig, state, {id, ...other}, values);
        };
        intl.formatNumber = (...args) => {
            let [value, {format: prefixedFormat, ...other}] = args;
            let [prefix, format] = prefixedFormat.split(separator);
            let namespace = namespaces[prefix];
            if (format === undefined || !namespace) {
                return formatNumber(config, state, ...args);
            }
            let nsConfig = Object.assign({}, config, {
                formats: namespace.formats
            });
            return formatNumber(nsConfig, state, value, {format, ...other});
        };
        return context;
    }
}


/**
 * Inserts namespace messages and formats into context.intl.
 */
export class IntlNamespace extends Component {
    static propTypes = {
        namespace: PropTypes.string.isRequired,
        messages: PropTypes.object,
        formats: PropTypes.object,
        children: PropTypes.element.isRequired
    };

    static contextTypes = {
        intl: intlShape.isRequired
    };

    static childContextTypes = {
        intl: intlShape.isRequired
    };

    getChildContext() {
        let {namespace, children, ...other} = this.props;
        let {intl} = this.context;
        if (intl.namespaces !== undefined) {
            intl.namespaces[namespace] = other;
        }
        return this.context;
    }

    render() {
        return Children.only(this.props.children);
    }
}


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
