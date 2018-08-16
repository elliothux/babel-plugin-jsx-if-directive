
function getAttrASTAndIndexByName(node, attrName) {
    if (!node) return;

    const { type, attributes } = node;
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

function removeAttrASTByIndex(node, index) {
    const { attributes } = node;
    node.attributes = attributes.splice(index, 1);
}

function findNextNode(path, siblings, index) {
    if (!siblings) return null;

    const nextPath = siblings[index + 1];
    if (!nextPath) return null;

    const { type, value } = nextPath;
    if (type === 'JSXText' && !value.trim())
        return findNextNode(nextPath, siblings, index+1);
    return type === 'JSXElement' ? nextPath : null;
}



module.exports = {
    getAttrASTAndIndexByName,
    removeAttrASTByIndex,
    findNextNode
};
