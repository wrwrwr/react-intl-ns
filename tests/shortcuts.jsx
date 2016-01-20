import {isValidElement} from 'react';
import {FormattedHTMLMessage, FormattedMessage,
        FormattedNumber} from 'react-intl';

import {intlShortcuts, intlMessageShortcut, intlNumberShortcut} from '../main';


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


describe("Shortcut factories", () => {
    it("a new message-like shortcut can be created", () => {
        class MessageLike extends FormattedMessage {}
        let factory = intlMessageShortcut(MessageLike);
        let shortcut = factory();
        let element = shortcut`legomenon`;
        element.type.should.equal(MessageLike);
        element.props.id.should.equal('legomenon');
    });

    it("message-like shortcuts prefix ids with namespace", () => {
        class MessageLike extends FormattedMessage {}
        let factory = intlMessageShortcut(MessageLike);
        let shortcut = factory('hapax');
        let element = shortcut`legomenon`;
        element.type.should.equal(MessageLike);
        element.props.id.should.equal('hapax::legomenon');
    });

    it("message-like shortcuts can be used as a function, with values", () => {
        class MessageLike extends FormattedMessage {}
        let factory = intlMessageShortcut(MessageLike);
        let shortcut = factory('dis');
        let element = shortcut('legomenon', {v: 'value'});
        element.type.should.equal(MessageLike);
        element.props.id.should.equal('dis::legomenon');
        element.props.values.should.deep.equal({v: 'value'});
    });

    it("a new number-like shortcut can be created", () => {
        class NumberLike extends FormattedNumber {}
        let factory = intlNumberShortcut(NumberLike);
        let shortcut = factory();
        let element = shortcut(5);
        element.type.should.equal(NumberLike);
        expect(element.props.format).to.be.undefined();
        element.props.value.should.equal(5);
    });

    it("number-like shortcuts prefix format keys with namespace", () => {
        class NumberLike extends FormattedNumber {}
        let factory = intlNumberShortcut(NumberLike);
        let shortcut = factory('tris');
        let element = shortcut('legomenon', 5);
        element.type.should.equal(NumberLike);
        element.props.format.should.equal('tris::legomenon');
        element.props.value.should.equal(5);
    });
});
