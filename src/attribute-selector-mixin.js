const attrTokeRegexp = /^([\w\-:]+)\s*?(?:(\*|~|\||\^|\$|)=\s*(?:'|"|)([\w\W]+?)(?:'|"|)(?:\s([iI])|)|)$/;

const escapeRegExp = (str) => {
    if(str === undefined) {
        return;
    }
    
    return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}

module.exports = (base = class {}) => {
    return class extends base {
        parseAttributeExpression(attrString) {
            attrString = attrString.replace(/^\s+/, '')
                .replace(/\s+$/, '');
                
            let  match = attrTokeRegexp.exec(attrString);
            
            let attrName = match[1];
            let attrMatchExpression = match[2];
            let attrValue = match[3];
            let modifier = match[4];
            
            return this.buildMatchToken(attrName, attrMatchExpression, attrValue, modifier);
        }
        
        buildMatchToken(name, matchExpression, value, modifier) {
            value = escapeRegExp(value);
            switch(matchExpression) {
                case '*':
                    matchExpression = new RegExp(`${value}`, modifier);
                    break;
                case '~':
                    matchExpression = new RegExp(`(?:\\s|^)${value}(?:\\s|$)`, modifier);
                    break;
                case '|':
                    matchExpression = new RegExp(`^${value}(?:\\-|$)`, modifier);
                    break;
                case '^':
                    matchExpression = new RegExp(`^${value}`, modifier);
                    break;
                case '$':
                    matchExpression = new RegExp(`${value}$`, modifier);
                    break;
                default: 
                    if (value == undefined) value = '[\\w\\W]*?';
                    matchExpression = new RegExp(`^${value}$`, modifier);
                    break;
            }
            return {
                name: name,
                value: matchExpression
            }
        }
    }
} 