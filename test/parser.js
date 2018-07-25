const assert = require('assert');

const XSDoc = require('./setup.js');
const XSDocument = require("../src/document.js");
const XSDOMParser = require("../index.js");

describe('XSDOMParse', () => {
    describe('#parseFromString', () => {
        it('should return a document', () => {
            assert.ok(XSDoc instanceof XSDocument);
        });
        
        it('document should have only one child and should equal #documentElement', () => {
            assert.ok(XSDoc.childNodes.length == 1);
            assert.equal(XSDoc.childNodes[0], XSDoc.documentElement);
        });
        
        it('document should handle content only tags properly (style, script)', () => {
            let scriptContent = 'let a = 5; let b = "<\\/script>";';
            
            let doc = new XSDOMParser().parseFromString(`<div><script>${scriptContent}</script><script></script></div>`);
            assert.equal(doc.documentElement.firstElementChild.tagName, 'script');
            assert.equal(doc.documentElement.firstElementChild.textContent, scriptContent);
        });
    });
});