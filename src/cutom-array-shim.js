/**
 * Shim to enable native array extending with es6 classes.
 * Babel does not support extending native classes
 */
function CustomArray() {
    Array.call(this);
    Array.prototype.slice.call(arguments, 0).forEach(function(item) {
        this.push(item);
    }.bind(this));
}

CustomArray.prototype = Array.prototype;
CustomArray.prototype.constructor = CustomArray;

module.exports = CustomArray;