class NodeFilter {
    static get FILTER_ACCEPT() { return 1; }
    static get FILTER_REJECT() { return 2; }
    static get FILTER_SKIP() { return 3; }
    static get SHOW_ALL() { return 4294967295; }
    static get SHOW_ELEMENT() { return 1; }
    static get SHOW_ATTRIBUTE() { return 2; }
    static get SHOW_TEXT() { return 4; }
    static get SHOW_CDATA_SECTION() { return 8; }
    static get SHOW_ENTITY_REFERENCE() { return 16; }
    static get SHOW_ENTITY() { return 32; }
    static get SHOW_PROCESSING_INSTRUCTION() { return 64; }
    static get SHOW_COMMENT() { return 128; }
    static get SHOW_DOCUMENT() { return 256; }
    static get SHOW_DOCUMENT_TYPE() { return 512; }
    static get SHOW_DOCUMENT_FRAGMENT() { return 1024; }
    static get SHOW_NOTATION() { return 2048; }
}

class TreeWalker {
    constructor(root, whatToShow, filter) {
        this._ = {};
        this._filter = filter;
        this._root = root;
        this._whatToShow = whatToShow;
        this._flatTree = [];
        this._iterator = -1;
        
        this._reducer();
    }
    
    get filter() {
        return this._filter;
    }
    
    get root() {
        return this._root;
    }
    
    get whatToShow() {
        return this._whatToShow;
    }
    
    get currentNode() {
        return this._flatTree[this._iterator] || null;
    }
    
    _listFilter(item) {
        if(!this._filter || this._filter.acceptNode(item) == NodeFilter.FILTER_ACCEPT) {
            return 0;
        }
        
        if(this._filter.acceptNode(item) == NodeFilter.FILTER_SKIP) {
            return 1;
        }
        
        if(this._filter.acceptNode(item) == NodeFilter.FILTER_REJECT) {
            return -1;
        }
    }
    
    _shouldShowItem(item) {
        if(this._listFilter(item) == 0) {
            return true;
        } else {
            return false;
        }
    }
    
    _reducer() {
        let reducer = (list, item) => {
            let filterType = this._listFilter(item);
            if (filterType === 0)
                if (this._whatToShow == NodeFilter.SHOW_ALL) {
                    list.push(item);
                } else if (this._whatToShow == NodeFilter.SHOW_ELEMENT &&
                    item.nodeType == 1) {
                    list.push(item);
                } else if (this._whatToShow == NodeFilter.SHOW_TEXT &&
                    item.nodeType == 3) {
                    list.push(item);
                } else if (this._whatToShow == NodeFilter.SHOW_CDATA_SECTION && 
                    item.nodeType == 4) {
                    list.push(item);
                } else if (this._whatToShow == NodeFilter.SHOW_COMMENT && 
                    item.nodeType == 8) {
                    list.push(item);
                }
            
            if (filterType !== -1)
                item.childNodes.reduce(reducer, list);
            
            return list;
        };
        
        this._flatTree = [this._root].reduce(reducer, []);
    }
    
    parentNode() {
        let parent = this.currentNode.parentNode;
        let index = this._flatTree.indexOf(parent);
        
        if (index !== -1) {
            this._iterator = index;
            
            return parent;
        }
        
        return null;
    }

    firstChild() {
        let node = this.currentNode;
        for(let i = 0; i < node.childNodes.length; i++) {
            let index = this._flatTree.indexOf(node.childNodes[i]);
            if (index !== -1) {
                this._iterator = index;
                return node.childNodes[i];
            }
        }
        
        return null;
    }

    lastChild() {
        let node = this.currentNode;
        for(let i = node.childNodes.length - 1; i >= 0; i--) {
            let index = this._flatTree.indexOf(node.childNodes[i]);
            if (index !== -1) {
                this._iterator = index;
                return node.childNodes[i];
            }
        }
        
        return null;
    }

    previousSibling() {
        let node = this.currentNode;
        while((node = node.previousSibling)) {
            let index = this._flatTree.indexOf(node);
            if(index !== -1) {
                this._iterator = index;
                return node;
            }
        }
        
        return null;
    }

    nextSibling() {
        let node = this.currentNode;
        while((node = node.nextSibling)) {
            let index = this._flatTree.indexOf(node);
            if(index !== -1) {
                this._iterator = index;
                return node;
            }
        }
        
        return null;
    }
    
    nextNode() {
        if(this._iterator == this._flatTree.length) {
            return null;
        }
        
        this._iterator++;
        return this.currentNode;
    }
    
    previousNode() {
        if(this._iterator == -1) {
            return null;
        }
        
        this._iterator--;
        return this.currentNode;
    }
}

module.exports = {
    TreeWalker: TreeWalker,
    NodeFilter: NodeFilter
};