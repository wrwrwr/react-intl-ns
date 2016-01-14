import {isValidElement} from 'react';
import {FormattedHTMLMessage, FormattedMessage,
        FormattedNumber} from 'react-intl';

import {intlShortcuts, registerIntlShortcut} from '../main';


describe("Default shortcuts", () => {
    const {t, h, n} = intlShortcuts();

    it("t() inserts a formatted message", () => {
        let element = t('id');
        isValidElement(element).should.be.true();
        element.type.should.equal(FormattedMessage);
        element.props.id.should.equal('id');
    });

    it("t() can be used as a template tag", () => {
        let element = t`id`;
        isValidElement(element).should.be.true();
        element.type.should.equal(FormattedMessage);
        element.props.id.should.equal('id');
    });

    it("t() evaluates the id template", () => {
        let a = 5;
        let element = t`id${a}`;
        isValidElement(element).should.be.true();
        element.type.should.equal(FormattedMessage);
        element.props.id.should.equal('id5');
    });

    it("t() can be passed some values", () => {
        let element = t('id', {v1: 1, v2: 2});
        isValidElement(element).should.be.true();
        element.type.should.equal(FormattedMessage);
        element.props.id.should.equal('id');
        element.props.values.should.deep.equal({v1: 1, v2: 2});
    });

    it("h() inserts a formatted HTML message", () => {
        let element = h('id');
        isValidElement(element).should.be.true();
        element.type.should.equal(FormattedHTMLMessage);
        element.props.id.should.equal('id');
    });

    it("h() can be used as a template tag", () => {
        let element = h`id`;
        isValidElement(element).should.be.true();
        element.type.should.equal(FormattedHTMLMessage);
        element.props.id.should.equal('id');
    });

    it("h() evaluates the id template", () => {
        let a = 5;
        let element = h`id${a}`;
        isValidElement(element).should.be.true();
        element.type.should.equal(FormattedHTMLMessage);
        element.props.id.should.equal('id5');
    });

    it("h() can be passed some values", () => {
        let element = h('id', {v1: 1, v2: 2});
        isValidElement(element).should.be.true();
        element.type.should.equal(FormattedHTMLMessage);
        element.props.id.should.equal('id');
        element.props.values.should.deep.equal({v1: 1, v2: 2});
    });

    it("n() inserts a formatted number", () => {
        let element = n('currency', 4);
        isValidElement(element).should.be.true();
        element.type.should.equal(FormattedNumber);
        element.props.format.should.equal('currency');
        element.props.value.should.equal(4);
    });

    it("n() can be used without a format", () => {
        let element = n(4);
        isValidElement(element).should.be.true();
        element.type.should.equal(FormattedNumber);
        expect(element.props.format).to.be.undefined();
        element.props.value.should.equal(4);
    });
});


describe("Shortcuts registration", () => {
    it("a new shortcut can be registered", () => {
        registerIntlShortcut('l', () => 'legomenon');
        const {l} = intlShortcuts();
        l.should.equal('legomenon');
    });

    it("shortcut factories get a namespace prefixer", () => {
        registerIntlShortcut('l', prefix => prefix('legomenon'));
        const {l} = intlShortcuts('hapax');
        l.should.equal('hapax::legomenon');
    });

    it("an arbitrary function can be registered", () => {
        registerIntlShortcut('l', () => arg => `${arg} legomenon`);
        const {l} = intlShortcuts();
        l('dis').should.equal('dis legomenon');
    });

    it("default shortcuts may be overridden", () => {
        registerIntlShortcut('t', () => arg => `${arg} legomenon`);
        const {t} = intlShortcuts();
        t('tris').should.equal('tris legomenon');
    });
});
