require("./tree-walker.js");

const assert = require('assert');
const XSDoc = require('./setup.js');
const XSElement = require("../src/element.js");

const expectedInnerHtml = `
    <head>
        <title>tests</title>
    </head>
    <body>
        <div>
            <span></span>
            <p></p>
            <div>
                <span class="span enabled:true chain[1]"></span>
                <p test="pref-attr"></p>
                <input data-attr="test" ns:attr="test" type="text" name="test" />
            </div>
        </div>
        
        <custom-element id="test-id"></custom-element>
        <iregular:element></iregular:element>
    </body>
`;

const expectedOuterHtml = `<html>
    <head>
        <title>tests</title>
    </head>
    <body>
        <div>
            <span></span>
            <p></p>
            <div>
                <span class="span enabled:true chain[1]"></span>
                <p test="pref-attr"></p>
                <input data-attr="test" ns:attr="test" type="text" name="test" />
            </div>
        </div>
        
        <custom-element id="test-id"></custom-element>
        <iregular:element></iregular:element>
    </body>
</html>`;

describe('Element', () => {
    it('#constructor', () => {
        let elem = new XSElement('tag', 1);
           
        assert.ok(elem instanceof XSElement);
        assert.ok(elem.tagName == 'tag');
        assert.ok(elem.nodeType == 1);
    });
    
    it('#getElementById', () => {
        let elem = XSDoc.documentElement.getElementById('test-id')
        assert.ok(elem instanceof XSElement);
        assert.ok(elem.tagName == 'custom-element');
        
        elem = XSDoc.documentElement.getElementById('none')
        assert.ok(elem == null);
    });
    
    it('#getElementsByClassName', () => {
        let elems = XSDoc.documentElement.getElementsByClassName('span')
        assert.ok(elems instanceof Array);
        assert.ok(elems[0].tagName == 'span');
        
        elems = XSDoc.documentElement.getElementsByClassName('none')
        assert.ok(elems.length == 0);
    });
    
    it('#getElementsByTagName', () => {
        let elems = XSDoc.documentElement.getElementsByTagName('body')
        assert.ok(elems instanceof Array);
        assert.ok(elems[0].tagName == 'body');
        
        elems = XSDoc.documentElement.getElementsByTagName('none')
        assert.ok(elems.length == 0);
    });
    
    it('#ownerDocument', () => {
       assert.equal(XSDoc.documentElement.ownerDocument, XSDoc);
           
       let elem = new XSElement('tag', {}, 1);
       assert.equal(elem.ownerDocument, null);
    });
    
    it('#innerHTML', () => {
        assert.equal(XSDoc.documentElement.innerHTML, expectedInnerHtml);
        
        let elem = new XSElement('custom-tag');
        let innerHtml = elem.innerHTML = '<div><span>test is successfull</span></div>';
        
        assert.equal(elem.innerHTML, innerHtml);

    });
    
    it('#outerHTML', () => {
        assert.equal(XSDoc.documentElement.outerHTML, expectedOuterHtml);
        
        let elem = new XSElement('custom-tag');
        elem.innerHTML = '<div><span>test is successfull</span></div>';
        let outerHtml = elem.children[0].outerHTML = '<p>replacing node</p>';
        assert.equal(elem.children[0].outerHTML, outerHtml);
    });
    
    it('#appendChild', () => {
        let elem = new XSElement('custom-tag');
        
        let child = new XSElement('span', 1);
        elem.appendChild(child);
        assert.ok(elem.childNodes.length == 1);
        assert.equal(child.tagName, 'span');
        assert.equal(child.parentNode, elem);
    });
    
    it('#insertBefore', () => {
        let elem = new XSElement('custom-tag');
        elem.innerHTML = '<div></div>';
        
        let newElem = new XSElement('span', 1);
        elem.insertBefore(newElem, elem.children[0]);
        
        assert.equal(elem.children.length, 2);
        assert.equal(elem.children[0], newElem);
    });
    
    it('#insertAfter', () => {
        let elem = new XSElement('custom-tag');
        elem.innerHTML = '<div></div>';
        
        let newElem = new XSElement('span', 1);
        elem.insertAfter(newElem, elem.children[0]);
        
        assert.equal(elem.children.length, 2);
        assert.equal(elem.children[1], newElem);
    });
    
    it('#removeChild', () => {
        let elem = new XSElement('custom-tag');
        elem.innerHTML = '<div></div>';
        
        elem.removeChild(elem.children[0]);
        
        assert.equal(elem.children.length, 0);
    });
    
    it('#getAttribute', () => {
        let elem = new XSElement('custom-tag', 1, {test: 'test'});
        assert.equal(elem.getAttribute('test'), 'test');
    });
    
    it('#setAttribute', () => {
        let elem = new XSElement('custom-tag', 1, {test: 'test'});
        elem.setAttribute('test', 'test-changed');
        assert.equal(elem.getAttribute('test'), 'test-changed');
    });
    
    it('#hasAttribute', () => {
        let elem = new XSElement('custom-tag', 1, {test: 'test'});
        
        assert.ok(elem.hasAttribute('test'));
        assert.ok(!elem.hasAttribute('test-none'));
    });
    
    it('#removeAttribute', () => {
        let elem = new XSElement('custom-tag', 1, {test: 'test'});
        elem.removeAttribute('test');
        
        assert.ok(!elem.hasAttribute('test'));
    });
    
    it('#classList#add', () => {
        XSDoc.documentElement.classList.add('test');
        
        assert.equal(XSDoc.documentElement.attributes.class, 'test');
    });
    
    it('#firstChild', () => {
        let elem = XSDoc.querySelector('body');
        assert.equal(elem.firstChild.tagName, '#text');
    });
    
    it('#firstElementChild', () => {
        let elem = XSDoc.querySelector('body');
        assert.equal(elem.firstElementChild.tagName, 'div');
    });
    
    it('#lastChild', () => {
        let elem = XSDoc.querySelector('body');
        assert.equal(elem.lastChild.tagName, '#text');
    });
    
    it('#lastElementChild', () => {
        let elem = XSDoc.querySelector('body');
        assert.equal(elem.lastElementChild.tagName, 'iregular:element');
    });
    
    it('#nextSibling', () => {
        let elem = XSDoc.querySelector('custom-element');
        assert.equal(elem.nextSibling.tagName, '#text');
    });
    
    it('#nextElementSibling', () => {
        let elem = XSDoc.querySelector('custom-element');
        assert.equal(elem.nextElementSibling.tagName, 'iregular:element');
    });
    
    it('#previousSibling', () => {
        let elem = XSDoc.querySelector('custom-element');
        assert.equal(elem.previousSibling.tagName, '#text');
    });
    
    it('#previousElementSibling', () => {
        let elem = XSDoc.querySelector('custom-element');
        assert.equal(elem.previousElementSibling.tagName, 'div');
    });
});