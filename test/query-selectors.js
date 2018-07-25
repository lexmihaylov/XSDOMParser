require("./document.js");

const assert = require('assert');
const XSDoc = require('./setup.js');

describe('QuerySelectable', () => {
    describe('#querySelector, #querySelectorAll, #matches', () => {
        describe('tag name and ancestor selectors', () => {
            it('`` should throw an exception', () => {
                assert.throws(() => XSDoc.querySelectorAll(''), SyntaxError);
            });
            
            it('`*`should return an array of elements', () => {
                let elems = XSDoc.querySelectorAll('*');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length > 0);
            });
            
            it('`no-elem` should return an empty array', () => {
                let elems = XSDoc.querySelectorAll('no-elem');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 0);
            });
            
            it('`body input` should return an array of one input element', () => {
                let elems = XSDoc.querySelectorAll('body input');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.equal(elems[0].tagName, 'input');
            });
            
            it('`body > input` should return an empty array', () => {
                let elems = XSDoc.querySelectorAll('body > input');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 0);
            });
            
             it('`div > input` should return an array of one input element', () => {
                let elems = XSDoc.querySelectorAll('div > input');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.equal(elems[0].tagName, 'input');
            });
            
            it('`p + input` should return an array of one input element', () => {
                let elems = XSDoc.querySelectorAll('p + input');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.equal(elems[0].tagName, 'input');
            });
            
            it('`span + input` should return an empty array', () => {
                let elems = XSDoc.querySelectorAll('span + input');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 0);
            });
            
            it('`span ~ input` should return an array of one input element', () => {
                let elems = XSDoc.querySelectorAll('span ~ input');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.equal(elems[0].tagName, 'input');
            });
            
            it('`p ~ input` should return an array of one input element', () => {
                let elems = XSDoc.querySelectorAll('p ~ input');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.equal(elems[0].tagName, 'input');
            });
            
            it('`body p + div > span ~ input` should return an array of one input element', () => {
                let elems = XSDoc.querySelectorAll('body p + div > span ~ input');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.equal(elems[0].tagName, 'input');
            });
            
            it('`body custom-element` should return an array of one custom element', () => {
                let elems = XSDoc.querySelectorAll('body custom-element');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.equal(elems[0].tagName, 'custom-element');
            });
            
            it('`body iregular:element` should not be valid', () => {
                assert.throws(() => {
                    let elems = XSDoc.querySelectorAll('body iregular:element');    
                });
            });
            
            it('`body iregular\\\\:element` should return an array of one custom element', () => {
                let elems = XSDoc.querySelectorAll('body iregular\\:element');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.equal(elems[0].tagName, 'iregular:element');
            });
            
            it('`body * p` should return only 2 elements', () => {
                let elems = XSDoc.querySelectorAll('body * p');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 2);
                assert.equal(elems[0].tagName, 'p');
                assert.equal(elems[1].tagName, 'p');
            });
        });
        
        describe('id selectors', () => {
            it('`#test-id` should return an elem', () => {
                let elems = XSDoc.documentElement.querySelectorAll('#test-id');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.ok(elems[0].tagName == 'custom-element');
                assert.ok(elems[0].attributes.id == 'test-id');
            });
            
            it('`#undef#test-id` should return an elem', () => {
                let elems = XSDoc.documentElement.querySelectorAll('#asdf#test-id');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.ok(elems[0].tagName == 'custom-element');
                assert.ok(elems[0].attributes.id == 'test-id');
            });
            
            it('`#test-id#undef` should return an empty array', () => {
                let elems = XSDoc.documentElement.querySelectorAll('#test-id#undef');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 0);
            });
        });
        
        describe('class selectors', () => {
           it('`.span` should return an elem', () => {
                let elems = XSDoc.documentElement.querySelectorAll('.span');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.ok(elems[0].tagName == 'span');
                assert.ok(elems[0].classList.contains('span'));
            });
            
            it('`.enabled:true` should throw an exception', () => {
                assert.throws(() => {
                    XSDoc.documentElement.querySelectorAll('.enabled:true');    
                });
            });
            
            it('`.enabled\\\\:true` should return an elem', () => {
                let elems = XSDoc.documentElement.querySelectorAll('.enabled\\:true');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.ok(elems[0].tagName == 'span');
                assert.ok(elems[0].classList.contains('enabled:true'));
            });
            
            it('`.chain[1]` should return an empty array', () => {
                let elems = XSDoc.documentElement.querySelectorAll('.chain[1]');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 0);
            });
            
            it('`.chain\\\\[1\\\\]` should return an elem', () => {
                let elems = XSDoc.documentElement.querySelectorAll('.chain\\[1\\]');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.ok(elems[0].tagName == 'span');
                assert.ok(elems[0].classList.contains('chain[1]'));
            });
            
            it('`.chain\\\\[1\\\\].enabled\\\\:true` should return an element', () => {
                let elems = XSDoc.documentElement.querySelectorAll('.chain\\[1\\].enabled\\:true');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.ok(elems[0].tagName == 'span');
            });
            
            it('`.chain\\\\[1\\\\].enabled` should return an empty array', () => {
                let elems = XSDoc.documentElement.querySelectorAll('.chain\\[1\\].enabled');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 0);
            });
        });
        
        describe('attribute selectors', () => {
           it('`[name]` should return an elem', () => {
                let elems = XSDoc.documentElement.querySelectorAll('[name]');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.ok(elems[0].tagName == 'input');
                assert.ok(elems[0].attributes['name'] !== undefined);
            });
            
            it('`[name=test]` should return an elem', () => {
                let elems = XSDoc.documentElement.querySelectorAll('[name=test]');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.ok(elems[0].tagName == 'input');
                assert.ok(elems[0].attributes['name'] == 'test');
            });
            
            it('`[name="test"]` should return an elem', () => {
                let elems = XSDoc.documentElement.querySelectorAll('[name="test"]');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.ok(elems[0].tagName == 'input');
                assert.ok(elems[0].attributes['name'] == 'test');
            });
            
            it('`[name=\'test\']` should return an elem', () => {
                let elems = XSDoc.documentElement.querySelectorAll('[name=\'test\']');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.ok(elems[0].tagName == 'input');
                assert.ok(elems[0].attributes['name'] == 'test');
            });
            
            it('`[undef_attr]` should return an empty array', () => {
                let elems = XSDoc.documentElement.querySelectorAll('[undef_attr]');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 0);
            });
            
            it('`[class*="true"]` should return an elem', () => {
                let elems = XSDoc.documentElement.querySelectorAll('[class*="true"]');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.ok(elems[0].tagName == 'span');
            });
            
            it('`[class~="true"]` should return an empty array', () => {
                let elems = XSDoc.documentElement.querySelectorAll('[class~="true"]');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 0);
            });
            
            it('`[class~="span"]` should return an element', () => {
                let elems = XSDoc.documentElement.querySelectorAll('[class~="span"]');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.ok(elems[0].tagName == 'span');
            });
            
            it('`[test|="pref"]` should return an element', () => {
                let elems = XSDoc.documentElement.querySelectorAll('[test|="pref"]');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.ok(elems[0].tagName == 'p');
            });
            
            it('`[test^="pref"]` should return an element', () => {
                let elems = XSDoc.documentElement.querySelectorAll('[test^="pref"]');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.ok(elems[0].tagName == 'p');
            });
            
            it('`[class$="[1]"]` should return an element', () => {
                let elems = XSDoc.documentElement.querySelectorAll('[class$="[1]"]');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.ok(elems[0].tagName == 'span');
            });
            
            it('`[class~="span"][class*=\'true\']` should return an element', () => {
                let elems = XSDoc.documentElement.querySelectorAll('[class~="span"][class*=\'true\']');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 1);
                assert.ok(elems[0].tagName == 'span');
            });
        });
        
        describe('pseudo selectors', () => {
            it('`:first-child` should return more than one element', () => {
                let elems = XSDoc.documentElement.querySelectorAll(':first-child');
                assert.ok(elems instanceof Array);
                assert.ok(elems.length > 1);
            });
            
            it('`:last-child` should return more than one element', () => {
                let elems = XSDoc.documentElement.querySelectorAll(':last-child');
                assert.ok(elems instanceof Array);
                assert.ok(elems.length > 1);
            });
            
            it('`:nth-child(1)` should return more than one element', () => {
                let elems = XSDoc.documentElement.querySelectorAll(':nth-child(1)');
                assert.ok(elems instanceof Array);
                assert.ok(elems.length > 1);
            });
            
            it('`:empty` should return more than one element', () => {
                let elems = XSDoc.documentElement.querySelectorAll(':empty');
                assert.ok(elems instanceof Array);
                assert.ok(elems.length > 1);
            });
            
            it('`:not([test])` should return more than one element', () => {
                let elems = XSDoc.documentElement.querySelectorAll(':not([test])');
                assert.ok(elems instanceof Array);
                assert.ok(elems.length > 1);
            });
            
            it('`span:first-child` should return two element', () => {
                let elems = XSDoc.documentElement.querySelectorAll('span:first-child');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 2);
                assert.ok(elems[0].attributes.class == undefined);
                assert.ok(elems[1].attributes.class == 'span enabled:true chain[1]');
            });
            
            it('`span:last-child` should return an empty array', () => {
                let elems = XSDoc.documentElement.querySelectorAll('span:last-child');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 0);
            });
            
            it('`span:nth-child(1)` should return two element', () => {
                let elems = XSDoc.documentElement.querySelectorAll('span:nth-child(1)');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 2);
                assert.ok(elems[0].attributes.class == undefined);
                assert.ok(elems[1].attributes.class == 'span enabled:true chain[1]');
            });
            
            it('`span:nth-child(10)` should return an empty array', () => {
                let elems = XSDoc.documentElement.querySelectorAll('span:nth-child(10)');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 0);
            });
            
            it('`span:empty` should return two element', () => {
                let elems = XSDoc.documentElement.querySelectorAll('span:empty');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 2);
                assert.ok(elems[0].attributes.class == undefined);
                assert.ok(elems[1].attributes.class == 'span enabled:true chain[1]');
            });
            
            it('`div:empty` should return an empty array', () => {
                let elems = XSDoc.documentElement.querySelectorAll('div:empty');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length == 0);
            });
            
            it('`div:not(:first-child)` should return an element', () => {
                let elems = XSDoc.documentElement.querySelectorAll('div:not(:first-child)');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length > 0);
            });
            
            it('`body :not(div):not(span):not(p):not(custom-element):not(iregular\\:element)` should return an element', () => {
                let elems = XSDoc.documentElement.querySelectorAll('body :not(div):not(span):not(p):not(custom-element):not(iregular\\:element)');
                
                assert.ok(elems instanceof Array);
                assert.ok(elems.length > 0);
            });
        });
        
        describe('multi selectors', () => {
           it('`body, div`', () => {
               let elems = XSDoc.documentElement.querySelectorAll('body, div');
               assert.equal(elems.length, 3);
               assert.equal(elems[0].tagName, 'body');
               assert.equal(elems[1].tagName, 'div');
               assert.equal(elems[2].tagName, 'div');
           });
           
           it('`body * , div *`', () => {
               let elems = XSDoc.documentElement.querySelectorAll('body * , div *');
               assert.equal(elems.length, 9);
           });
           
           it('`body span.span , div span` should be ordered as appear in dom', () => {
               let elem = XSDoc.documentElement.querySelector('body span.span , div span');
               assert.notEqual(elem, null);
               assert.equal(elem.tagName, 'span');
               assert.ok(!elem.classList.contains('span'));
           });
        });
    });
})