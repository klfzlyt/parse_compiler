function isNumber(val) {
  val = val + '';
  var regPos = /^\d+(\.\d+)?$/; //非负浮点数
  var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
  if (regPos.test(val) || regNeg.test(val)) {
    return true;
  } else {
    return false;
  }
}
export default function codeGenerator(node) {
  
  switch (node.type) {
 
    case 'Program':
      return node.body.map(codeGenerator).join('\n');

    case 'ExpressionStatement':
      return codeGenerator(node.expression) + ';';

    case 'ConditionalExpression':
      return `${codeGenerator(node.test)} ? ${codeGenerator(
        node.consequent
      )}:${codeGenerator(node.alternate)} `;

    case 'AssignmentExpression':
      return `${node.left.name}${node.operator}${codeGenerator(node.right)}`;

    case 'BinaryExpression':
      return `(${codeGenerator(node.left)}) ${node.operator} (${codeGenerator(
        node.right
      )})`;

    case 'ForStatement':
      return `for(${codeGenerator(node.init)}; ${codeGenerator(
        node.test
      )} ; ${codeGenerator(node.update)}){
        ${codeGenerator(node.body)}
      }`;

    case 'CallExpression':
      return (
        node.callee + '(' + node.arguments.map(codeGenerator).join(', ') + ')'
      );
  
    case 'Identifier':
      return node.name;

    case 'Literal':
      return !isNumber(node.value) ? `'${node.value}'` : node.value;

    case 'BlockStatement':
      return node.body.map(codeGenerator).join(';\n');

    case 'VariableDeclaration':
      let declators = '';
      node.declarations.forEach((element, index) => {
        let isEnd = index == node.declarations.length - 1;
        if (element.init !== null) {
          isEnd
            ? (declators += `${element.Identifier}=${codeGenerator(
                element.init
              )}`)
            : (declators += `${element.Identifier}=${codeGenerator(
                element.init
              )},`);
        } else {
          isEnd
            ? (declators += `${element.Identifier}`)
            : (declators += `${element.Identifier},`);
        }
      });

      return `let ${declators};/*${node.kind}*/`;
    case 'UnaryExpression':
        return `${node.operator}${codeGenerator(node.argument)}`   
    case 'UpdateExpression':
        return `${node.argument}${node.operator}`    
    case 'ReturnStatement':
      return `return ${codeGenerator(node.argument)};`;  
    case 'WhileStatement':
      return `
          while(${codeGenerator(node.test)}){
            ${codeGenerator(node.body)}
          }
      `
      
    case 'FunctionDeclaration':
      let params = '';
      node.params.forEach((element, index) => {
        if (index == 0) {
          params += element.id.value;
          params += `/*${element.field.value}*/`;
        } else {
          params += ',';
          params += element.id.value;
          params += `/*${element.field.value}*/`;
        }
      });
      return `
        function ${node.id}(${params}){
          ${codeGenerator(node.body)}
        }
      `;
    case 'IfStatement':
      let express = codeGenerator(node.test || {});
      let consequent = codeGenerator(node.consequent || {});
      let alternate;
      if (node.alternate) {
        alternate = codeGenerator(node.alternate || {});
      }    
      return alternate === undefined
        ? `
            if(${express}){
                ${consequent}
            }
        `
        : `
        if(${express}){
            ${consequent}
        }
        else{
            ${alternate}
        }
        `;
    
    default:
      return '';
  }
}
