const Element = require('./element.js');
const Document  = require('./document.js');
const voidElements = require("./void-elements.js");

const textOnlyElements = [
    'script',
    'style'
];

const openTagRegex = '<([\\w\\-:]+)([\\w\\W]*?)(\\/|)>';
const closeTagRegex = '<[\\s]*?\/[\\s]*?([\\w\\-:]+)[\\s]*?>';
const textRegex = '(^[^<]+)';
const commentRegexp = '<!--([\\w\\W]*?)-->';
const cdataRegexp = '<\\!\\[CDATA\\[([\\w\\W]*?)\\]\\]>';

const parseRegex = new RegExp('(?:' + [
    openTagRegex,
    closeTagRegex,
    textRegex,
    commentRegexp,
    cdataRegexp
].join('|') +')', 'i');

const attrRegex = /(?:([\w\-:]+)=(?:"|')([\w\W]*?)(?:"|')|([\w\-:]+))/g;

module.exports = class DOMParse {
    constructor(domString, contentType = 'text/html', mode = 'moderate') {
        this.domString = domString;
        this.contentType = contentType;
        this.mode = mode;
        this.document = this.createDocumentNode();
        this.tagSequence = [];
        this.parseIterator = 0;

        while(this.parseIterator < this.domString.length) {
            this.parseIteration();
        }
    }

    static parse(string, contentType = 'text/html', mode = 'moderate') {
        let instance = new this(string, contentType, mode);

        return instance.document;
    }

    createDocumentNode() {
        let docType = '';
        if (this.contentType == 'text/html') {
            docType = '<!DOCTYPE html>';
           this.domString = this.domString.replace(/<!DOCTYPE[\w\W]*?>/i, (match) => {
                docType = match;
                return '';
            });
        } else if (this.contentType == 'text/xml') {
            docType = '<?xml version="1.0"?>';
            this.domString = this.domString.replace(/<\?xml[\w\W]*?\?>/i, (match) => {
                docType = match;
                return '';
            });
        } else {
            throw new Error('Unsupported content type.');
        }

        this.domString = this.domString.replace(/^\s+/, '')
            .replace(/\s+$/, '');

        let doc = new Document(
            this.contentType, docType);

        return doc;
    }

    parseAttrString(attrString) {
        let attrMap = {};
        let match;
        while((match = attrRegex.exec(attrString))) {
            let attrName = (match[1] || match[3]);
            let attrVal = match[2];

            attrMap[attrName] = attrVal;
        }

        return attrMap;
    }
    
    /**
     * Converts tag names and attribute names to the proper format according
     * to the document content type. If the content type is text/xml the tag
     * names and attributes will be left untouched otherwise they will be converted
     * to lower case strings
     * 
     * @param {string} type
     * @param {string|Object} val
     * 
     * @returns {string|Object}
     */
    contentTypeCompatible(type, val) {
        if(this.contentType == 'text/html' && val !== undefined) {
            switch(type) {
                case 'tagName':
                    return val.toLowerCase();
                case 'attributes':
                    let attrList = {};
                    for(let key in val) {
                        attrList[key.toLowerCase()] = val[key];
                    }
                    return attrList;
                default:
                    return val;
            }
        }
        
        return val;
    }

    parseIteration() {
        let domString = this.domString.slice(this.parseIterator);
        let match = parseRegex.exec(domString);
        if (match) {
            if(match.index !== 0) {
                // display warning when skipping undefined dom expressions
                let parseError = new Error(
                    `Cannot parse \`${domString.slice(0, match.index)
                        .replace(/^\s+/, '')
                        .replace(/\s+$/, '')}\`.`);

                switch(this.mode) {
                    case 'strict':
                        throw parseError;
                    case 'moderate':
                        console.warn(parseError);
                        break;
                }
            }

            this.parseIterator += match.index + match[0].length;

            let tagName = this.contentTypeCompatible('tagName', match[1]);
            let attributes = this.contentTypeCompatible('attributes',
                this.parseAttrString(match[2]));
            let isSelfClosing = Boolean(match[3]);
            let closeTagName = this.contentTypeCompatible('tagName', match[4]);
            let text = match[5];
            let comment = match[6];
            let cdata = match[7];

            let parentTag = this.tagSequence[this.tagSequence.length - 1] ||
                this.document;

            if (text) {
                // text node
                let tag = new Element('#text', 3);
                tag.textContent = text;

                parentTag.appendChild(
                    tag
                );
            } else if (tagName) {
                // open dom element
                let tag = new Element(tagName, 1, attributes);
                
                if(textOnlyElements.indexOf(tagName.toLowerCase()) != -1) {
                    let textOnlyExp = new RegExp(`([\\w\\W]*?)<\\/${tagName}>`);
                    let domString = this.domString.slice(this.parseIterator);
                    let match = textOnlyExp.exec(domString);
                    if(match) {
                        tag.textContent = match[1];
                        this.parseIterator += match.index + match[0].length;
                    }
                }

                parentTag.appendChild(
                    tag
                );

                if(!isSelfClosing &&
                    voidElements.indexOf(tagName.toLowerCase()) == -1 &&
                    textOnlyElements.indexOf(tagName.toLowerCase()) == -1) {
                        
                    this.tagSequence.push(tag);
                }

            } else if (closeTagName) {
                // close tag name
                // trow exception if opened and close tags do not match
                var openTag = this.tagSequence.pop();
                if(this.mode !== 'strict') return;
                
                if(!openTag) {
                    throw new Error(`\`${closeTagName}\` has no open tag definition.`);
                }

                if(closeTagName != openTag.tagName) {
                    throw new Error(`\`${openTag.tagName}\` is not properly closed.`);
                }
            } else if (comment !== undefined) {
                let tag = new Element('#comment', 8);
                tag.textContent = comment;

                parentTag.appendChild(tag);
            } else if (cdata !== undefined) {
                let tag = new Element('cdata-section', 4);
                tag.textContent = cdata;
                parentTag.appendChild(tag);
            }
        } else {
            let previewStart = this.parseIterator - 10;
            let previewEnd = this.parseIterator + 10;
            throw new Error(`Unable to parse dom string near \`${
                this.domString.slice(previewStart > 0? previewStart: 0, previewEnd <= this.domString.length? previewEnd: this.domString.length - 1)
            }\``);
        }
    }
};