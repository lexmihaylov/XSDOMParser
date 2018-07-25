require("./parser.js");

const assert = require('assert');
const XSDoc = require('./setup.js');
const XSElement = require("../src/element.js");

describe('Document', () => {
    it('doctype should be `<!DOCTYPE html>`', () => {
        assert.equal(XSDoc.doctype, '<!DOCTYPE html>');
    });
   
    it('#nodeType should be 9', () => {
        assert.equal(XSDoc.nodeType, 9); 
    });
    
    it('#documentElement should be a `html` tag', () => {
        assert.equal(XSDoc.documentElement.tagName, 'html'); 
    });
    
    it('content type should be `text/html`', () => {
        assert.equal(XSDoc.contentType, 'text/html');
    });
    
    it('adding a second childNode to document should fail', () => {
        assert.throws(() => {
            XSDoc.appendChild(XSDoc.createElement('html'));    
        });
    });
    
    it('#ownerDocument should equal this document instance', () => {
        assert.equal(XSDoc.ownerDocument, XSDoc);
    });
    
    it('#createElement', () => {
       let el = XSDoc.createElement('test');
       assert.ok(el instanceof XSElement);
       assert.equal(el.tagName, 'test');
       assert.equal(el.nodeType, 1);
    });
    
    it('#createTextNode', () => {
       let el = XSDoc.createTextNode('test');
       assert.ok(el instanceof XSElement);
       assert.equal(el.textContent, 'test');
       assert.equal(el.nodeType, 3);
    });
    
    it('#innerHTML', () => {
        assert.equal(XSDoc.innerHTML, undefined);
        XSDoc.innerHTML = 'test';
        assert.equal(XSDoc.innerHTML, undefined);
        assert.equal(XSDoc.documentElement.tagName, 'html');
    });
    
    it('#outerHTML', () => {
        assert.equal(XSDoc.outerHTML, undefined);
        XSDoc.innerHTML = 'test';
        assert.equal(XSDoc.outerHTML, undefined);
        assert.equal(XSDoc.documentElement.tagName, 'html');
    });
});