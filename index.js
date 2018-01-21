
module.exports = function ({types: t}) {
    let attrName = 'if';

    function JSXElementVisitor(path) {
        attrName = this.opts && this.opts.attrName || attrName;

        path.traverse({ JSXElement: JSXElementVisitor });

        const ifBinding = getAttrAST(path.node.openingElement, 'if');
        if (ifBinding) {
            const nextNode = findNextNode(path, path.parent.children, path.key);
            let alertnateAst = getAndRemoveAlertnateAst(nextNode);
            if (alertnateAst.type !== 'NullLiteral')
                path.parent.children = path.parent.children.filter(node => node !== nextNode);

            path.replaceWith(
                t.conditionalExpression(
                    ifBinding.value.expression,
                    path.node,
                    alertnateAst
                )
            );
        }

        function getAndRemoveAlertnateAst(node) {
            if (!node) return t.nullLiteral();
            const elseBinding = getAttrAST(node.openingElement, 'else');
            if (elseBinding) return node;

            // TODO: Supporting "elseIf" expression
            // const elseIfBinding = getAttrAST(node.openingElement, 'elif', false);
            // if (elseIfBinding) {
            //     console.log(elseIfBinding);
            //     return node;
            // }

            return t.nullLiteral();
        }

        function findNextNode(path, sibling, key) {
            if (!sibling) return null;
            const nextPath = sibling[key + 1];
            if (!nextPath) return null;
            if (nextPath.type === 'JSXText' && !nextPath.value.trim())
                return findNextNode(nextPath, sibling, key+1);
            return nextPath.type === 'JSXElement' ? nextPath : null;
        }

        function getAttrAST(openingElement, attrName, willRemove=true) {
            if (openingElement.type !== 'JSXOpeningElement') return null;
            const index = openingElement.attributes.findIndex(attr => attr.name && attr.name.name === attrName);
            if (index < 0) return null;

            const attrBinding = openingElement.attributes[index];
            if (willRemove)
                openingElement.attributes = openingElement.attributes.filter(attr => attr !== attrBinding);
            return attrBinding;
        }
    }

    return {
        visitor: {
            JSXElement: JSXElementVisitor
        }
    }
};
