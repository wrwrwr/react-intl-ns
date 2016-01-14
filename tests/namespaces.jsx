import React from 'react';
import {renderToStaticMarkup} from 'react-dom/server';
import {FormattedMessage, IntlProvider} from 'react-intl';

import {IntlNamespace, IntlNsProvider, intlShortcuts} from '../main';


describe("Namespaces", () => {
    it("uses the right messages in the app and comp basic example", () => {
        const {t: ta} = intlShortcuts();
        const {t: tc} = intlShortcuts('comp');
        const appMessages = {title: "app"};
        const compMessages = {en: {title: "comp"}};
        renderToStaticMarkup(
                <IntlNsProvider locale='en' messages={appMessages}>
                    <div>
                        {ta`title`}
                        <IntlNamespace namespace='comp' messages={compMessages}>
                            {tc`title`}
                        </IntlNamespace>
                    </div>
                </IntlNsProvider>
        ).should.equal('<div><span>app</span><span>comp</span></div>');
    });

    it("uses messages from the right sibling namespace", () => {
        const {t: t1} = intlShortcuts('ns1');
        const {t: t2} = intlShortcuts('ns2');
        const ns1Messages = {en: {title: "title1"}};
        const ns2Messages = {en: {title: "title2"}};
        renderToStaticMarkup(
                <IntlNsProvider locale='en'>
                    <div>
                        <IntlNamespace namespace='ns1' messages={ns1Messages}>
                            {t1`title`}
                        </IntlNamespace>
                        <IntlNamespace namespace='ns2' messages={ns2Messages}>
                            {t2`title`}
                        </IntlNamespace>
                    </div>
                </IntlNsProvider>
        ).should.equal('<div><span>title1</span><span>title2</span></div>');
    });

    it("uses correct messages within nested namespaces", () => {
        const {t: ta} = intlShortcuts();
        const {t: to} = intlShortcuts('outer');
        const {t: ti} = intlShortcuts('inner');
        const appMessages = {title: "app title"};
        const outerMessages = {en: {title: "outer title"}};
        const innerMessages = {en: {title: "inner title"}};
        renderToStaticMarkup(
                <IntlNsProvider locale='en' messages={appMessages}>
                    <div>
                        {ta`title`}
                        <IntlNamespace namespace='outer'
                                       messages={outerMessages}>
                            <div>
                                {ta`title`}
                                {to`title`}
                                <IntlNamespace namespace='inner'
                                               messages={innerMessages}>
                                    <div>
                                        {ta`title`}
                                        {to`title`}
                                        {ti`title`}
                                    </div>
                                </IntlNamespace>
                            </div>
                        </IntlNamespace>
                    </div>
                </IntlNsProvider>
        ).should.equal(
                '<div>' +
                    '<span>app title</span>' +
                    '<div>' +
                        '<span>app title</span>' +
                        '<span>outer title</span>' +
                        '<div>' +
                            '<span>app title</span>' +
                            '<span>outer title</span>' +
                            '<span>inner title</span>' +
                        '</div>' +
                    '</div>' +
                '</div>');
    });

    it("limits messages from a namespace to its scope", () => {
        const {t} = intlShortcuts('namespace');
        const messages = {en: {title: "ns title"}};
        sinon.stub(console, 'error');
        renderToStaticMarkup(
                <IntlNsProvider locale='en'>
                    <div>
                        {t`title`}
                        <IntlNamespace namespace='namespace'
                                       messages={messages}>
                            {t`title`}
                        </IntlNamespace>
                    </div>
                </IntlNsProvider>
        ).should.equal('<div><span>title</span><span>ns title</span></div>');
        console.error.should.have.been.calledWithMatch('namespace::title');
        console.error.restore();
    });

    it("uses namespace formats, through a shortcut", () => {
        const {n} = intlShortcuts('namespace');
        const formats = {number: {format: {style: 'percent'}}};
        renderToStaticMarkup(
                <IntlNsProvider locale='en'>
                    <IntlNamespace namespace='namespace' formats={formats}>
                        {n('format', .26)}
                    </IntlNamespace>
                </IntlNsProvider>
        ).should.equal('<span>26%</span>');
    });

    it("uses namespace formats, within a message", () => {
        const {t} = intlShortcuts('namespace');
        const messages = {en: {title: '{value, number, format}'}};
        const formats = {number: {format: {style: 'percent'}}};
        renderToStaticMarkup(
                <IntlNsProvider locale='en'>
                    <IntlNamespace namespace='namespace' messages={messages}
                                   formats={formats}>
                        {t('title', {value: .26})}
                    </IntlNamespace>
                </IntlNsProvider>
        ).should.equal('<span>26%</span>');
    });

    it("the provider can be used with standard intl components", () => {
        const messages = {title: 'intl title'};
        renderToStaticMarkup(
                <IntlNsProvider locale='en' messages={messages}>
                    <FormattedMessage id='title' />
                </IntlNsProvider>
        ).should.equal('<span>intl title</span>');
    });

    it("namespaces do not interfere with the standard provider", () => {
        const appMessages = {'namespace::title': 'app title'};
        const nsMessages = {en: {title: 'ns title'}};
        renderToStaticMarkup(
                <IntlProvider locale='en' messages={appMessages}>
                    <IntlNamespace namespace='namespace' messages={nsMessages}>
                        <FormattedMessage id='namespace::title' />
                    </IntlNamespace>
                </IntlProvider>
        ).should.equal('<span>app title</span>');
    });

    it("shortcuts can be used without the provider or a namespace", () => {
        const {t} = intlShortcuts('namespace');
        const messages = {'namespace::title': 'ns title'};
        renderToStaticMarkup(
                <IntlProvider locale='en' messages={messages}>
                    {t`title`}
                </IntlProvider>
        ).should.equal('<span>ns title</span>');
    });
});
