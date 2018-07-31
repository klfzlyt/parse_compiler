
export default function traverser(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }
  function traverseNode(node, parent, left, right) {        
    let methods = visitor[node.type];
    if (methods && methods.enter) {
      methods.enter(node, parent);
    }
    switch (node.type) {
      case 'Program':
        traverseArray(node.body, node);
        break;

      case 'FunctionDeclaration':
        traverseArray([node.body], node);
        break;

      case 'WhileStatement':
         traverseNode(node.body,node);
         break;

      case 'BlockStatement':
        traverseArray(node.body, node);
        break;

      case 'VariableDeclaration':
        traverseArray(node.declarations, node);
        break;

      case 'VariableDeclarator':
        traverseNode(node.Identifier, node);
        break;     
      case 'CallExpression':
        traverseArray(node.arguments, node);
        break;
      case 'AssignmentExpression':
        traverseNode(node.left, node);
        traverseNode(node.right, node);
        break;

      case 'BinaryExpression':
        traverseNode(node.left, node);
        traverseNode(node.right, node);
        break;          
      default:
        break;
    }
   
    if (methods && methods.exit) {
      methods.exit(node, parent);
    }
  }
  traverseNode(ast, null);
}
