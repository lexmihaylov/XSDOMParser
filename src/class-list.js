const CustomArray = require('./cutom-array-shim.js');

module.exports = class ClassList extends CustomArray {
    constructor(...argv) {
        super(...argv);

        this.onChange = null;
    }

    __triggerChange() {
        if(typeof this.onChange == 'function') {
            this.onChange(this);
        }
    }

    contains(item) {
        return this.indexOf(item) !== -1;
    }

    add(...items) {
        items.forEach((item) => {
            if (this.indexOf(item) == -1) {
                this.push(item);
            }
        });
        
        if(items.length > 0) this.__triggerChange();
    }

    remove(...items) {
        items.forEach((item) => {
            if(this.indexOf(item) !== -1) {
                this.splice(this.indexOf(item), 1);
            }
        });
        
        if(items.length > 0) this.__triggerChange();
    }

    item(index) {
        return this[index];
    }

    toggle(item, force = true) {
        if(!force) return;

        if (this.contains(item)) {
            this.remove(item);
            this.__triggerChange();
        } else {
            this.add(item);
            this.__triggerChange();
        }
    }

    replace(oldItem, newItem) {
        if(this.indexOf(oldItem) !== -1) {
            this.splice(this.indexOf(oldItem), 1, newItem);
            this.__triggerChange();
        }
    }
}