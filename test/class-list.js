require('./element.js');
const assert = require("assert");
const ClassList = require("../src/class-list.js");

let classList;
describe('ClassList', () => {
    it('#constructor', () => {
        classList = new ClassList('class1', 'class2');
        
        assert.ok(classList instanceof ClassList);
        assert.equal(classList.join(' '), 'class1 class2');
    });
    
    it('#add + #onChange', () => {
        classList.onChange = () => {
            assert.equal(classList.join(' '), 'class1 class2 class3');
        };
        
        classList.add('class3');
        
        classList.onChange = () => {
            assert.equal(classList.join(' '), 'class1 class2 class3 class4 class5');
        };
        
        classList.add('class4', 'class5');
    });
    
    it('#remove', () => {
        classList.onChange = () => {
            assert.equal(classList.join(' '), 'class2 class3 class4 class5');
        };
        classList.remove('class1');
        
        classList.onChange = () => {
            assert.equal(classList.join(' '), 'class4 class5');
        };
        classList.remove('class2', 'class3');
    });
    
    it('#toggle', () => {
        classList.onChange = () => {
            assert.equal(classList.join(' '), 'class5');
        };
        classList.toggle('class4');
        
        classList.onChange = () => {
            assert.equal(classList.join(' '), 'class5 class4');
        };
        classList.toggle('class4');
    });
    
    it('#replace', () => {
        classList.onChange = () => {
            assert.equal(classList.join(' '), 'class5 class1');
        };
        classList.replace('class4', 'class1');
    });
});