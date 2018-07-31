import Tag from '../Lexical/tag.js';
import * as Nodes from './node';
export default class Parse {
  constructor(tokens) {
    this.tokens = tokens;
    //
    this.index = 0;
    this.lookahead = this.tokens[this.index];
  }

  move() {
    // debugger
    do {
      this.index++;
      this.lookahead = this.tokens[this.index] || {};
    } while (this.lookahead.tag === Tag.COMMENT);
  }

  error(s) {
    throw new Error(
      'near line : ' + s + ' ' + this.lookahead.value || this.lookahead.tag
    );
  }

  match(t) {
    if (this.lookahead.tag == t) {
      this.move();
      return true;
    } else {
      this.error(
        'syntax error at ' + this.lookahead.value || this.lookahead.tag
      );
    }
  }
  next() {
    return this.tokens[this.index + 1] || {};
  }

  parseIfStatement() {
    let expr;
    let statement1, statement2;
    this.match(Tag.IF);
    this.match('(');
    expr = this.parseConditionalExpression();
    this.match(')');

    statement1 = this.parseStatement();
    if (this.lookahead.tag != Tag.ELSE) {
      return new Nodes.IfStatement(expr, statement1, null);
    } else {
      this.match(Tag.ELSE);
      statement2 = this.parseStatement();
      return new Nodes.IfStatement(expr, statement1, statement2);
    }
  }

  parseVariableDeclaration() {
    let declarators = [];
    // debugger;
    // int f=3,z,v;
    let type = this.parseType();
    while (this.lookahead.value || this.lookahead.tag != ';') {
      let identifiler = this.lookahead.value || this.lookahead.tag;

      if (identifiler == ',') {
        this.move();
        //update
        identifiler = this.lookahead.value || this.lookahead.tag;
      }

      this.match(Tag.ID);
      if ((this.lookahead.value || this.lookahead.tag) == '=') {
        this.match(Tag.ASSIGN);
        declarators.push(
          // this.lookahead.value 为初始化的值
          new Nodes.VariableDeclarator(
            identifiler,
            this.parseConditionalExpression()
          )
        );
      } else {
        declarators.push(
          // this.lookahead.value 为初始化的值
          new Nodes.VariableDeclarator(identifiler, null)
        );
      }
      if ((this.lookahead.value || this.lookahead.tag) == ';') {
        break;
      }
      this.move();
    }
    this.match(';');
    return new Nodes.VariableDeclaration(declarators, type.value);
  }
  parseType() {
    let type = this.lookahead;
    this.match(Tag.BASIC);
    return type;
  }

  parseConditionalExpression() {
    let expr = this.parseBinaryExpression();
    if (this.lookahead.tag == '?') {
      this.match('?');
      let consequent = this.parseConditionalExpression();
      this.match(':');
      let alternate = this.parseConditionalExpression();
      expr = new Nodes.ConditionalExpression(expr, consequent, alternate);
    }
    return expr;
  }
  parseBinaryExpression() {
    return this.parseOrExpressgion();
  }
  parseOrExpressgion() {
    let left = this.parseAndExpression();
    while (this.lookahead.tag == Tag.OR) {
      this.move();
      left = new Nodes.BinaryExpression('||', left, this.parseAndExpression());
    }
    return left;
  }
  parseAndExpression() {
    let left = this.parseEqulityExpression();
    while (this.lookahead.tag == Tag.AND) {
      this.move();
      left = new Nodes.BinaryExpression(
        '&&',
        left,
        this.parseEqulityExpression()
      );
    }
    return left;
  }
  parseEqulityExpression() {
    let left = this.parseRelationExpression();
    while (this.lookahead.tag == Tag.EQUAL || this.lookahead.tag == Tag.NOTE) {
      let op = this.lookahead.value;
      this.move();
      left = new Nodes.BinaryExpression(
        op,
        left,
        this.parseRelationExpression()
      );
    }
    return left;
  }
  parseRelationExpression() {
    let left = this.parseArithExpression();
    switch (this.lookahead.tag) {
      case Tag.LE:
      case Tag.LEE:
      case Tag.GEE:
      case Tag.GE:
        let tok = this.lookahead.value || this.lookahead.tag;
        this.move();
        return new Nodes.BinaryExpression(
          tok,
          left,
          this.parseArithExpression()
        );
      default:
        return left;
    }
  }
  parseArithExpression() {
    let left = this.parseMutilOrdivideExpression();
    while (this.lookahead.tag == '+' || this.lookahead.tag == '-') {
      let tok = this.lookahead.tag;
      this.move();
      left = new Nodes.BinaryExpression(
        tok,
        left,
        this.parseMutilOrdivideExpression()
      );
    }
    return left;
  }
  parseAssignmentExpression() {
    // debugger;
    let expr;
    let identifiler = this.lookahead;
    this.match(Tag.ID);
    let operator = this.lookahead.value || this.lookahead.tag;
    if (operator == '++' || operator == '--') {
      this.move();
      return new Nodes.UpdateExpression(
        operator,
        identifiler.value || identifiler.tag
      );
    }
    this.move();
    //this.match(Tag.ASSIGN);  
    // operator = += -= /= *=  
    expr = new Nodes.AssignmentExpression(
      operator,
      new Nodes.Identifier(identifiler.value || identifiler.tag),
      this.parseConditionalExpression()
    );
    // match(';');
    return expr;
  }
  parseMutilOrdivideExpression() {
    let left = this.parseUnaryExpression();
    while (this.lookahead.tag == '*' || this.lookahead.tag == Tag.DIVIDE) {
      let tok = this.lookahead.value || this.lookahead.tag;
      this.move();
      left = new Nodes.BinaryExpression(tok, left, this.parseUnaryExpression());
    }
    return left;
  }
  parseUnaryExpression() {
    if ((this.lookahead.value || this.lookahead.tag) == '-') {
      this.move();
      return new Nodes.UnaryExpression('-', this.parseUnaryExpression());
    } else if ((this.lookahead.value || this.lookahead.tag) == '!') {
      this.move();
      return new Nodes.UnaryExpression('!', this.parseUnaryExpression());
    } else return this.parseFactorExpression();
  }
  parseFactorExpression() {
    let expr;
    switch (this.lookahead.tag) {
      case '(':
        this.move();
        expr = this.parseBinaryExpression();
        this.match(')');
        return expr;
      case Tag.NUM:
      case Tag.REAL:
      case Tag.TRUE:
      case Tag.FALSE:
        expr = new Nodes.Literal(this.lookahead.value, this.lookahead.value);
        this.move();
        return expr;
      case '~':
        this.match('~');
        expr = new Nodes.Literal(
          this.lookahead.value.toString(),
          this.lookahead.value
        );
        this.match(Tag.ID);
        this.match('~');
        return expr;
      case Tag.ID:
        if (this.next().value == '++' || this.next().value == '--') {
          let id = this.lookahead.value || this.lookahead.tag;
          this.move();
          let operator = this.lookahead.value || this.lookahead.tag;
          this.move();
          return new Nodes.UpdateExpression(operator, id);
        }
        let id = new Nodes.Identifier(
          this.lookahead.value || this.lookahead.tag
        );
        this.move();
        return id;
      case Tag.INVOKE:
        return this.parseCallExpression();
      default:
        this.error('syntax error');
        return expr;
    }
  }

  parseWhileStatement() {
    /*
      while(expr){

      }
    */
    this.match(Tag.WHILE);
    this.match('(');
    let testExpr = this.parseConditionalExpression();
    this.match(')');
    let blockStmt = this.parseBlock();
    return new Nodes.WhileStatement(testExpr, blockStmt);
  }

  parseFunctionDeclaration() {
    this.match(Tag.DEF);
    let funId = this.lookahead;
    this.match(Tag.ID);
    // 解析参数
    let params = [];
    this.match('(');

    while (true) {
      if (this.lookahead.tag == ')') {
        break;
      }

      let paramContinue = false;
      do {
        paramContinue = false;
        let type = this.parseType();
        let id = this.lookahead;
        this.match(Tag.ID);

        params.push(new Nodes.FunctionParameter(type, id));
        if (this.lookahead.tag == ',') {
          paramContinue = true;
          this.match(',');
        }
      } while (paramContinue);
    }

    this.match(')');

    // 解析block
    let funcBody = this.parseBlock();
    return new Nodes.FunctionDeclaration(funId.value, params, funcBody);
  }
  parseReturnStatement() {
    this.match(Tag.RETURN);
    let argu = this.parseConditionalExpression();
    return new Nodes.ReturnStatement(argu);
  }
  parseForStatement() {
    this.match(Tag.FOR);
    this.match('(');

    let init = this.parseAssignmentExpression();
    this.match(';');
    let test = this.parseConditionalExpression();
    this.match(';');
    let update = this.parseAssignmentExpression();
    this.match(')');
    let body = this.parseBlock();
    return new Nodes.ForStatement(init, test, update, body);
  }
  parseStatement() {
    switch (this.lookahead.tag) {
      case '{':
        return this.parseBlock();
      case ';':
        this.move();
        return null;
      case Tag.ID:
        let assginExpression;
        if (this.next().value == '++' || this.next().value == '--') {
          assginExpression = this.parseFactorExpression();
        } else {
          assginExpression = this.parseAssignmentExpression();
        }
        this.match(';');
        return assginExpression;
      case Tag.INVOKE:
        return this.parseCallExpression();
      case Tag.WHILE:
        return this.parseWhileStatement();
      case Tag.IF:
        return this.parseIfStatement();
      case Tag.FOR:
        return this.parseForStatement();
      case Tag.RETURN:
        return this.parseReturnStatement();
    }
  }
  parseCallExpression() {
    this.match(Tag.INVOKE);
    this.match('(');
    let callee = this.lookahead.value || this.lookahead.tag;
    this.match(Tag.ID);
    this.match(',');
    let arguments_f = [];
    while (this.lookahead.tag !== ')') {
      arguments_f.push(this.parseConditionalExpression());
      if (this.lookahead.tag === ')') {
        break;
      }
      this.match(',');
    }
    this.match(')');
    return new Nodes.CallExpression(callee, arguments_f);
    //this.match('')
  }

  parseScript() {
    //const node = this.createNode();
    const program = {
      type: 'Program',
      body: [],
    };
    let body = program.body;
    while (this.index !== this.tokens.length) {
      body.push(this.parseStatementListItem());
    }
    program.body = body.filter(_ => _);
    return program;
  }

  parseBlock() {
    //const node = this.createNode();
    this.match('{');
    const block = [];
    while (true) {
      if (this.lookahead.tag == '}') {
        break;
      }
      let stmt = this.parseStatementListItem();

      stmt && block.push(stmt);
    }
    this.match('}');
    return new Nodes.BlockStatement(block);
  }
  parseStatementListItem() {
    //let statement;
    // debugger;
    switch (this.lookahead.tag) {
      case Tag.DEF:
        return this.parseFunctionDeclaration();
      //变量声明
      case Tag.BASIC:
        return this.parseVariableDeclaration();
      case Tag.COMMENT:
        this.move();
        break;
      default:
        return this.parseStatement();
    }

    //return statement;
  }
}
