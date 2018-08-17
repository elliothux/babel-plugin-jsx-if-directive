
const t = require('@babel/types');

function findNextNode(path, siblings, index) {
    if (!siblings) return null;

    const nextPath = siblings[index + 1];
    if (!nextPath) return null;

    const { type, value } = nextPath;
    if (type === 'JSXText' && !value.trim())
        return findNextNode(nextPath, siblings, index+1);
    return type === 'JSXElement' ? nextPath : null;
}

function getAttrASTAndIndexByName(node, attrName) {
    if (!node || !node.openingElement) return null;

    const { type, attributes } = node.openingElement;
    if (type !== 'JSXOpeningElement') return null;

    const index = attributes.findIndex(
        attr => attr.name && attr.name.name === attrName
    );
    if (index < 0) return null;

    const attrBinding = attributes[index];
    return {
        attrBinding,
        index,
        node
    };
}

function removeNode(nodes, nodeToRemoved) {
    const index = nodes.findIndex((i) => i === nodeToRemoved);
    if (index >= 0) {
        nodes.splice(index, 1);
    }
}

function removeAttrASTByIndex(node, index) {
    const { openingElement } = node;
    if (!openingElement) return;

    const { attributes } = openingElement;
    attributes.splice(index, 1);
}

function transformIfBinding(path, ifBinding) {
    const { attrBinding, index, node } = ifBinding;

    removeAttrASTByIndex(node, index);

    const targetAST = t.conditionalExpression(
        attrBinding.value.expression,
        node,
        t.nullLiteral()
    );
    path.replaceWith(targetAST);
}

function transformElseBinding(path, ifBinding, elseBinding) {
    const {
        attrBinding: ifAttr,
        index: ifIndex,
        node: ifNode
    } = ifBinding;
    const {
        node: elseNode,
        index: elseIndex
    } = elseBinding;

    removeAttrASTByIndex(ifNode, ifIndex);
    removeAttrASTByIndex(elseNode, elseIndex);

    const targetAST = t.conditionalExpression(
        ifAttr.value.expression,
        ifNode,
        elseNode
    );
    path.replaceWith(targetAST);
}

function transformElseIfBindings(path, ifBinding, elseIfBindings, elseBinding) {
    const {
        attrBinding: ifAttr,
        index: ifIndex,
        node: ifNode
    } = ifBinding;

    removeAttrASTByIndex(ifNode, ifIndex);
    if (elseBinding) {
        const {
            node: elseNode,
            index: elseIndex
        } = elseBinding;
        removeAttrASTByIndex(elseNode, elseIndex);
    }
    elseIfBindings.forEach((binding) => {
        const { node, index } = binding;
        removeAttrASTByIndex(node, index);
    });

    const callee = t.arrowFunctionExpression([], t.blockStatement([
        t.ifStatement(
            ifAttr.value.expression,
            t.returnStatement(ifNode),
            getAlternteAST(elseIfBindings, elseBinding)
        )
    ]));
    const targetAST = t.callExpression(callee, []);
    path.replaceWith(targetAST);
}

function getAlternteAST(elseIfBindings, elseBinding, index=0) {
    if (index+1 < elseIfBindings.length) {
        const elseIfBinding = elseIfBindings[index];
        const {
            attrBinding,
            node
        } = elseIfBinding;
        return t.ifStatement(
            attrBinding.value.expression,
            t.returnStatement(node),
            getAlternteAST(elseIfBindings, elseBinding, index+1)
        );
    }
    if (elseBinding) {
        return t.returnStatement(elseBinding.node);
    }
    return null;

}

function log(...args) {
    args.forEach(i => {
        console.log(JSON.stringify(i, '', '     '));
    })
}


module.exports = {
    getAttrASTAndIndexByName,
    findNextNode,
    transformIfBinding,
    transformElseBinding,
    removeNode,
    transformElseIfBindings,
    log
};
