
const t = require('@babel/types');
const {
    getAttrASTAndIndexByName,
    removeAttrASTByIndex,
    findNextNode
} = require('./utils');




module.exports = function () {
    function JSXElementVisitor(path) {
        const {
            ifAttrName,
            elseAttrName,
            elseIfAttrName
        } = getAttrNamesFromOption();

        // path.traverse({ JSXElement: JSXElementVisitor });

        const ifBinding = getAttrASTAndIndexByName(path.node.openingElement, ifAttrName);
        if (!ifBinding) return;

        let {
            parent: { children: siblings },
            key: index
        } = path;

        let nextNode = findNextNode(path, siblings, index);
        if (nextNode) {
            let elseBinding = getAttrASTAndIndexByName(nextNode.openingElement, elseAttrName);
            const elseIfBindings = [];

            if (!elseBinding) {
                let elseIfBinding = getAttrASTAndIndexByName(nextNode.openingElement, elseIfAttrName);
                while (elseIfBinding) {
                    elseIfBindings.push(elseIfBinding);
                    index += 1;
                    nextNode = findNextNode(path, siblings, index);
                    elseIfBinding = nextNode ?
                        getAttrASTAndIndexByName(nextNode.openingElement, elseIfAttrName) :
                        null;
                }
                if (nextNode) {
                    elseBinding = getAttrASTAndIndexByName(nextNode.openingElement, elseAttrName);
                }
            }

            console.log(
                '\n\n-------else--------\n\n',
                elseBinding,
                '\n\n-------elif--------\n\n',
                elseIfBindings
            );
            //
            // let alertnateAst = getAndRemoveAlertnateAst(nextNode);
            // if (alertnateAst.type !== 'NullLiteral')
            //     path.parent.children = path.parent.children.filter(node => node !== nextNode);
            //
            // path.replaceWith(
            //     t.conditionalExpression(
            //         ifBinding.value.expression,
            //         path.node,
            //         alertnateAst
            //     )
            // );
        }

        function getAttrNamesFromOption() {
            const {
                ifAttrName: optIfAttrName,
                elseAttrName: optElseAttrName,
                elseIfAttrName: optElseIfAttrName
            } = this.opts || {};
            return {
                ifAttrName: optIfAttrName || 'if',
                elseAttrName: optElseAttrName || 'else',
                elseIfAttrName: optElseIfAttrName || 'elseIf',
            }
        }
    }

    return {
        visitor: {
            JSXElement: JSXElementVisitor
        }
    }
};


function _findNextNode(path, sibling, key) {
    if (!sibling) return null;
    const nextPath = sibling[key + 1];
    if (!nextPath) return null;
    if (nextPath.type === 'JSXText' && !nextPath.value.trim())
        return findNextNode(nextPath, sibling, key+1);
    return nextPath.type === 'JSXElement' ? nextPath : null;
}
