const ClassList = require('./class-list.js');
const AttributeSelectorMixin = require('./attribute-selector-mixin.js');
const PseudoSelectorMixin = require('./pseudo-selector-mixin.js');

const QsaSearchTypes = {
    default: 0, // deep
    shallow: 1, // direct decendant
    directSibling: 2,
    generalSibling: 3
};

const validQsRegex = /^[\\#\.,\$\^\|\w\-:=\s>\*~\+\[\]\(\)'"]+$/;

module.exports = class QuerySelectable extends AttributeSelectorMixin(
    PseudoSelectorMixin()) {
        
    __searchDom() {
        throw new TypeError('Method `__searchDom` is not implemented.');
    }

    __parseQuerySelectorString(selector) {
        if(!validQsRegex.test(selector)) {
            this.__throwInvalidQuerySelector();
        }

        let tokens = [];

        // normalize and sanitize the query selector string
        selector = selector.replace(/\s+/g, ' ')
            .replace(/\s*(>|\+|~|,)\s*/g, '$1')
            .replace(/^\s+/, '')
            .replace(/\s+$/, '');

        // create regular expressions for all the different tokens
        // added support for escaped queries like `.numbers\\:enabled`
        let tagSelector = '(?:\\s|>|\\+|~|^)([\\w-]+(?:[\\w-]*(?:\\\\.)*[\\w-]*)*|\\*)';
        let classNameSelector = '\\.([\\w-]+(?:[\\w-]*(?:\\\\.)*[\\w-]*)*)';
        let idSelector = '#([\\w-]+(?:[\\w-]*(?:\\\\.)*[\\w-]*)*)';
        let attrbuteSelector = '\\[([\\w\\W]+?(?:=(?:"|\')[\\w\\W]*?(?:"|\')|))\\]';
        let ancestorType = '(\\s|>|\\+|~)';
        let pseudoSelector = ':([\\w-]+(?:\\([\\w\\W]+?\\)|))';

        // concatinate all the regexes to one toke regex
        let tokenRegex = new RegExp(`(?:${[
            ancestorType,
            tagSelector,
            idSelector,
            classNameSelector,
            attrbuteSelector,
            pseudoSelector
        ].join('|')})`);
        
        while(!!selector) {
            let match = tokenRegex.exec(selector);
            selector = selector.slice(match.index + match[0].length);

            for(let i = 1; i < match.length; i++) {

                if(match[i] !== undefined) {
                    let keyword = match[i];
                    if(i !== 6) {
                        keyword = keyword.replace(/\\/g, '');
                    }
                    tokens.push({
                        type: i,
                        keyword: keyword
                    });

                }
            }
        }
        
        return tokens;
    }

    __qsaSearchType(separator) {
        switch(separator) {
            case '>':
                return QsaSearchTypes.shallow;
            case '+':
                return QsaSearchTypes.directSibling;
            case '~':
                return QsaSearchTypes.generalSibling;
            default:
                return QsaSearchTypes.default;
        }
    }

    __buildQsaCriterias(tokens) {
        let searchCriterias = [];
        let searchCriteria = {};
        tokens.forEach((token) => {
            switch (token.type) {
                case 1:
                    searchCriterias.push(searchCriteria);
                    searchCriterias.push({
                        searchType: this.__qsaSearchType(token.keyword)
                    });
                    
                    searchCriteria = {};
                    break;
                case 2:
                    if (token.keyword != '*') {
                        searchCriteria.tagName = token.keyword;
                    }
                    break;
                case 3:
                    searchCriteria.attributes = searchCriteria.attributes || {};
                    searchCriteria.attributes.id = token.keyword;
                    break;
                case 4:
                    searchCriteria.classList = searchCriteria.classList || [];
                    searchCriteria.classList.push(token.keyword);
                    break;
                case 5:
                    searchCriteria.attributes = searchCriteria.attributes || {};
                    let attrToken = this.parseAttributeExpression(token.keyword);
                    
                    searchCriteria.attributes[attrToken.name] = attrToken.value;
                    break;
                case 6:
                    searchCriteria.pseudoSelectors = searchCriteria.pseudoSelectors || [];
                    
                    let pseudoSelector = this.parsePseudoSelectorExression(token.keyword);
                    searchCriteria.pseudoSelectors.push(pseudoSelector);
            }
        });
        
        searchCriterias.push(searchCriteria);

        return searchCriterias;
    }

    __qsaSearchByType(contextList, criteria, one, searchType) {
        if(searchType == QsaSearchTypes.default || searchType == QsaSearchTypes.shallow) {
            return this.__qsaSearchTree(contextList, criteria, one, searchType);
        } else {
            return this.__qsaSearchSiblings(contextList, criteria, one, searchType);
        }
    }

    __qsaCompareNode(criteria, node) {
        let matches = true;
        Object.keys(criteria).forEach((prop, index) => {
            if (!(criteria[prop] instanceof RegExp) &&
                criteria[prop] instanceof Object &&
                prop != 'pseudoSelectors') {
                    
                matches = matches && this.__qsaCompareNode(criteria[prop], node[prop]);
                return;
            }

            if (node instanceof ClassList) {
                matches = matches && node.contains(criteria[prop]);
            } else if (criteria[prop] instanceof RegExp) {
                matches = matches && node[prop] !== undefined && criteria[prop].test(node[prop]);
            } else if (prop == 'pseudoSelectors') {
                criteria[prop].forEach((pseudoSelector) => {
                    matches = matches && pseudoSelector(node);
                });
            } else {
                matches = matches && node[prop] == criteria[prop];
            }
        });

        return matches;
    }

    __qsaSearchSiblings(contextList, criteria, one, searchType) {
        let foundNodes = [];
        for(let i = 0; i < contextList.length; i++) {
            let context = contextList[i];

            let parent = context.parentNode;
            let indexInParent = parent.children.indexOf(context);
            if(indexInParent !== -1) {
                let followingSiblings = parent.children.splice(indexInParent + 1);

                for(let j = 0; j < followingSiblings.length; j++) {
                    let nextSibling = followingSiblings[j];

                    if(this.__qsaCompareNode(criteria, nextSibling)) {
                        foundNodes.push(nextSibling);

                        if(one) break;
                    }

                    if(searchType == QsaSearchTypes.directSibling) {
                        break;
                    }
                }

                if(one && foundNodes.length > 0) break;
            }
        }

        return foundNodes;
    }

    __qsaSearchTree(contextList, criteria, one, searchType) {
        let foundNodes = [];
        contextList.forEach((context) => {
            foundNodes = foundNodes.concat(this.__searchDom(context, (node) => {
                return this.__qsaCompareNode(criteria, node);
            }, one, searchType == QsaSearchTypes.shallow));
        });

        return foundNodes;
    }

    __qsaSearch(contextList, criterias, one) {
        one = one || false;
        let foundNodes = [];

        for(let i = 0; i < criterias.length; i++) {
            let criteria = criterias[i];
            let searchType = QsaSearchTypes.default;

            if('searchType' in criteria) {
                searchType = criteria.searchType;
                criteria = criterias[i = i + 1];
            }


            foundNodes = this.__qsaSearchByType(
                contextList,
                criteria,
                one && i == criterias.length - 1,
                searchType
            );

            // get an unique list of matches
            foundNodes = foundNodes.filter((item, index, list) => {
                return list.indexOf(item) === index;
            });

            contextList = foundNodes;

            if(contextList.length == 0) {
                break;
            }
        }

        return foundNodes;
    }

    __throwInvalidQuerySelector(ex) {
        if(ex instanceof SyntaxError) throw ex;
        throw new SyntaxError('invalid query selector');
    }
    
    __qsaSort(list) {
        let reducer = (list, item) => {
            list.push(item);
            item.childNodes.reduce(reducer, list);
            
            return list;
        };
        
        let flatDom = [this].reduce(reducer, []);
        
        return list.sort((a, b) => {
            let aindex = flatDom.indexOf(a);
            let bindex = flatDom.indexOf(b);
            
            if (aindex > bindex) {
                return 1;
            } else if(aindex < bindex) {
                return -1;
            } else {
                return 0;
            }
        });
    }
    
    __execQsa(selector, one) {
        let found = [];
        let subSelectors = selector.split(',');
        
        for(let i = 0; i < subSelectors.length; i++) {
            let subSelector = subSelectors[i];
            
            let tokens = this.__parseQuerySelectorString(subSelector);
            let searchCriterias = this.__buildQsaCriterias(tokens);
            let foundInQuery = this.__qsaSearch([this], searchCriterias, one);
            
            foundInQuery.forEach((node) => {
                if(found.indexOf(node) == -1) {
                    found.push(node);
                }
            });
        }
        
        return subSelectors.length > 1? this.__qsaSort(found): found;
    }
    
    matches(selector) {
        let list = this.ownerDocument.querySelectorAll(selector);
        let i = list.length;
        while(--i >= 0 && list[i] !== this) {}
        
        return i > -1;
    }

    querySelector(selector) {
        try {
            return this.__execQsa(selector)[0] || null;
        } catch(ex) {
            this.__throwInvalidQuerySelector(ex);
        }
    }

    querySelectorAll(selector) {
        try {
            return this.__execQsa(selector);
        } catch(ex) {
            this.__throwInvalidQuerySelector(ex);
        }
    }
};
