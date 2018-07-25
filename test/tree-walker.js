require("./query-selectors.js");

const assert = require('assert');
const XSDoc = require('./setup.js');
const TreeWalker = require('../src/tree-walker.js').TreeWalker;
const NodeFilter = require('../src/tree-walker.js').NodeFilter;

describe('TreeWalker', () => {
    it('#constructor', () => {
        let treeWalker = XSDoc.createTreeWalker(
            XSDoc.documentElement, NodeFilter.SHOW_ALL);
        
        assert.ok(treeWalker instanceof TreeWalker);
        assert.equal(treeWalker._flatTree.length, 31);
        assert.equal(treeWalker._root, XSDoc.documentElement);
    });
    
    it('#whatToShow = NodeFilter.SHOW_ELEMENT', () => {
        let treeWalker = XSDoc.createTreeWalker(
            XSDoc.documentElement, NodeFilter.SHOW_ELEMENT);
        
        assert.equal(treeWalker._flatTree.length, 13);
    });
    
    it('#whatToShow = NodeFilter.SHOW_TEXT', () => {
        let treeWalker = XSDoc.createTreeWalker(
            XSDoc.documentElement, NodeFilter.SHOW_TEXT);
        
        assert.equal(treeWalker._flatTree.length, 18);
    });
    
    it('#whatToShow = NodeFilter.SHOW_COMMENT', () => {
        let treeWalker = XSDoc.createTreeWalker(
            XSDoc.documentElement, NodeFilter.SHOW_COMMENT);
        
        assert.equal(treeWalker._flatTree.length, 0);
    });
    
    it('#whatToShow = NodeFilter.SHOW_CDATA_SECTION', () => {
        let treeWalker = XSDoc.createTreeWalker(
            XSDoc.documentElement, NodeFilter.SHOW_CDATA_SECTION);
        
        assert.equal(treeWalker._flatTree.length, 0);
    });
    
    it('#filter = {acceptNode: {FILTER_ACCEPT || FILTER_SKIP}}', () => {
        let treeWalker = XSDoc.createTreeWalker(
            XSDoc.documentElement, 
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: (item) => {
                    return item.hasAttribute('data-attr')? 
                        NodeFilter.FILTER_ACCEPT: 
                        NodeFilter.FILTER_SKIP;
                }
            });
        
        assert.equal(treeWalker._flatTree.length, 1);
    });
    
    it('#filter = {acceptNode: {FILTER_ACCEPT || FILTER_REJECT}}', () => {
        let treeWalker = XSDoc.createTreeWalker(
            XSDoc.documentElement, 
            NodeFilter.SHOW_ELEMENT,
            {
                acceptNode: (item) => {
                    return item.hasAttribute('data-attr')? 
                        NodeFilter.FILTER_ACCEPT: 
                        NodeFilter.FILTER_REJECT;
                }
            });
        
        assert.equal(treeWalker._flatTree.length, 0);
    });
    
    it('#nextNode', () => {
        let treeWalker = XSDoc.createTreeWalker(
            XSDoc.documentElement, 
            NodeFilter.SHOW_ELEMENT);
            
        let index = 0;
        while(treeWalker.nextNode()) {
            assert.equal(treeWalker.currentNode, treeWalker._flatTree[index]);
            index++;
        }
        
        assert.equal(index, treeWalker._flatTree.length);
    });
    
    it('#previousNode', () => {
        let treeWalker = XSDoc.createTreeWalker(
            XSDoc.documentElement, 
            NodeFilter.SHOW_ELEMENT);
            
        let index = treeWalker._flatTree.length -1;
        treeWalker._iterator = treeWalker._flatTree.length;
        while(treeWalker.previousNode()) {
            assert.equal(treeWalker.currentNode, treeWalker._flatTree[index]);
            index--;
        }
        
        assert.equal(index, -1);
    });
});