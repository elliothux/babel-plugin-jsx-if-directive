
const {
  removeNode,
  findNextNode,
  transformIfBinding,
  transformElseBinding,
  transformElseIfBindings,
  getAttrASTAndIndexByName
} = require('./utils');

const defaultOpts = {
  ifAttrName: 'if',
  elseAttrName: 'else',
  elseIfAttrName: 'elseIf'
};

module.exports = function () {
  function JSXElementVisitor(path, { opts = defaultOpts }) {
    const {
      ifAttrName,
      elseAttrName,
      elseIfAttrName
    } = opts;

    const ifBinding = getAttrASTAndIndexByName(path.node, ifAttrName);
    if (!ifBinding) return;

    let {
      parent: { children: siblings },
      key: index
    } = path;

    let nextNode = findNextNode(path, siblings, index);
    if (!nextNode) return transformIfBinding(path, ifBinding);

    let elseBinding = getAttrASTAndIndexByName(nextNode, elseAttrName);
    const elseIfBindings = [];

    if (!elseBinding) {
      let elseIfBinding = getAttrASTAndIndexByName(nextNode, elseIfAttrName);
      while (elseIfBinding) {
        elseIfBindings.push(elseIfBinding);
        index += 1;
        nextNode = findNextNode(path, siblings, index);
        elseIfBinding = nextNode ?
          getAttrASTAndIndexByName(nextNode, elseIfAttrName) :
          null;
      }
      if (nextNode) {
        elseBinding = getAttrASTAndIndexByName(nextNode, elseAttrName);
      }
    }

    if (elseIfBindings.length > 0) {
      transformElseIfBindings(path, ifBinding, elseIfBindings, elseBinding);

      elseIfBindings.forEach((binding) => {
        removeNode(siblings, binding.node);
      });
      if (elseBinding) {
        removeNode(siblings, elseBinding.node);
      }
    } else if (elseBinding) {
      transformElseBinding(path, ifBinding, elseBinding);
      removeNode(siblings, elseBinding.node);
    }
  }

  return {
    visitor: {
      JSXElement: JSXElementVisitor
    }
  }
};
