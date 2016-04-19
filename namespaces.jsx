import {Children, Component, PropTypes} from 'react';
import {IntlProvider, intlShape} from 'react-intl';
import {formatHTMLMessage, formatMessage,
        formatNumber} from 'react-intl/lib/format';

import {separator} from './main';


/**
 * Wraps intl.format*() to use namespace messages and formats when appropriate.
 *
 * If a message or format id is prefixed as namespace::id, namespace messages
 * and formats (from intl.namespaces) are used for formatting.
 */
export class IntlNsProvider extends IntlProvider {
    static displayName = 'IntlNsProvider';

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
        intl.formatHTMLMessage = (...args) => {
            let [{id: prefixedId, ...other}, values] = args;
            let [prefix, id] = prefixedId.split(separator);
            let namespace = namespaces[prefix];
            if (id === undefined || !namespace) {
                return formatHTMLMessage(config, state, ...args);
            }
            let nsConfig = Object.assign({}, config, {
                messages: namespace.messages[intl.locale],
                formats: namespace.formats
            });
            return formatHTMLMessage(nsConfig, state, {id, ...other}, values);
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
    static displayName = 'IntlNamespace';

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
        let {namespace, children: _, ...other} = this.props;
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
