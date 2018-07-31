import Syntax from './syntax.js';
export class IfStatement {
  //    readonly type: string;
  //  readonly test: Expression;
  // readonly consequent: Statement;
  // readonly alternate: Statement | null;
  constructor(test, consequent, alternate) {
    this.type = Syntax.IfStatement;
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
  }
}

export class BlockStatement {
  //readonly type: string;
  //readonly body: Statement[];
  constructor(body) {
    this.type = Syntax.BlockStatement;
    this.body = body;
  }
}

export class FunctionDeclaration {
  // readonly type: string;
  // readonly id: Identifier | null;
  // readonly params: FunctionParameter[];
  // readonly body: BlockStatement;
  // readonly generator: boolean;
  // readonly expression: boolean;
  // readonly async: boolean;
  constructor(id, params, body) {
    this.type = Syntax.FunctionDeclaration;
    this.id = id;
    this.params = params;
    this.body = body;
    //  this.generator = generator;
    this.expression = false;
    //  this.async = false;
  }
}

export class FunctionParameter {
  constructor(type, id) {
    this.type = Syntax.TypeDeclarator;
    this.field = type;
    this.id = id;
  }
}

export class VariableDeclaration {
  constructor(declarations, kind) {
    this.type = Syntax.VariableDeclaration;
    //VariableDeclarator
    this.declarations = declarations;
    this.kind = kind;
  }
}
export class VariableDeclarator {
  constructor(Identifier, init) {
    this.type = Syntax.VariableDeclarator;
    this.Identifier = Identifier;
    this.init = init;
  }
}
export class Identifier {
  constructor(name) {
    this.type = Syntax.Identifier;
    this.name = name;
  }
}

export class AssignmentExpression {
  // readonly type: string;
  // readonly operator: string;
  // readonly left: Expression;
  // readonly right: Expression;
  constructor(operator, left, right) {
    this.type = Syntax.AssignmentExpression;
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

export class ForStatement {
  //readonly type: string;
  //readonly init: Expression | null;
  //readonly test: Expression | null;
  //readonly update: Expression | null;
  //body: Statement;
  constructor(init, test, update, body) {
    this.type = Syntax.ForStatement;
    this.init = init;
    this.test = test;
    this.update = update;
    this.body = body;
  }
}

export class ConditionalExpression {
  // readonly type: string;
  // readonly test: Expression;
  // readonly consequent: Expression;
  // readonly alternate: Expression;
  constructor(test, consequent, alternate) {
    this.type = Syntax.ConditionalExpression;
    this.test = test;
    this.consequent = consequent;
    this.alternate = alternate;
  }
}

export class BinaryExpression {
  // readonly type: string;
  // readonly operator: string;
  // readonly left: Expression;
  // readonly right: Expression;
  constructor(operator, left, right) {
    const logical = operator === '||' || operator === '&&';
    this.type = logical ? Syntax.LogicalExpression : Syntax.BinaryExpression;
    this.operator = operator;
    this.left = left;
    this.right = right;
  }
}

export class UnaryExpression {
  // readonly type: string;
  // readonly operator: string;
  // readonly argument: Expression;
  // readonly prefix: boolean;
  constructor(operator, argument) {
    this.type = Syntax.UnaryExpression;
    this.operator = operator;
    this.argument = argument;
  }
}

export class Literal {
  // readonly type: string;
  // readonly value: boolean | number | string | null;
  // readonly raw: string;
  constructor(value, raw) {
    this.type = Syntax.Literal;
    this.value = value;
    this.raw = raw;
  }
}

export class CallExpression {
  // readonly type: string;
  // readonly callee: Expression | Import;
  // readonly arguments: ArgumentListElement[];
  constructor(callee, args) {
    this.type = Syntax.CallExpression;
    this.callee = callee;
    this.arguments = args;
  }
}
export class WhileStatement {
  // readonly type: string;
  // readonly test: Expression;
  // readonly body: Statement;
  constructor(test, body) {
      this.type = Syntax.WhileStatement;
      this.test = test;
      this.body = body;
  }
}


export class UpdateExpression {
  // readonly type: string;
  // readonly operator: string;
  // readonly argument: Expression;
  // readonly prefix: boolean;
  constructor(operator, argument) {
      this.type = Syntax.UpdateExpression;
      this.operator = operator;
      this.argument = argument;
      // this.prefix = prefix;
  }
}

export class ReturnStatement {
  // readonly type: string;
  // readonly argument: Expression | null;
  constructor(argument) {
    this.type = Syntax.ReturnStatement;
    this.argument = argument;
  }
}

// export class ForStatement {
//   // readonly type: string;
//   // readonly init: Expression | null;
//   // readonly test: Expression | null;
//   // readonly update: Expression | null;
//   // body: Statement;
//   constructor(init, test, update, body) {
//       this.type = Syntax.ForStatement;
//       this.init = init;
//       this.test = test;
//       this.update = update;
//       this.body = body;
//   }
// }
