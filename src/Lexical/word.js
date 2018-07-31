import Token from './token.js';
import TAG from './tag.js';
import Tag from './tag.js';

export default class Word extends Token {
  constructor(value, tag) {
    super(tag);
    this.value = value;
  }
  static and = new Word('&&', TAG.AND);
  static or = new Word('||', TAG.OR);
  static less = new Word('<', TAG.LE);
  static greater = new Word('>', TAG.GE);
  static greater_equal = new Word('>=', TAG.GEE);
  static less_equal = new Word('<=', TAG.LEE);
  static equal = new Word('==', TAG.EQUAL);
  static assign = new Word('=', TAG.ASSIGN);
  static not = new Word('!', TAG.NOT);
  static not_equal = new Word('!=', TAG.NOTE);
  static divide = new Word('/', TAG.DIVIDE);
  static divide_equal = new Word('/=', TAG.DIVIDEE);
  static plus_plus = new Word('++','++');
  static plus_equal = new Word('+=','+=');
  static minus_minus = new Word('--','--');
  static mutil_equal = new Word('*=','*=');
  static minus_equal = new Word('-=','-=');
  //保留字
  static if = new Word('if', TAG.IF);
  static for = new Word('for',Tag.FOR);
  static else = new Word('else', TAG.ELSE);
  static while = new Word('while', TAG.WHILE);
  static do = new Word('do', TAG.DO);
  static switch = new Word('switch', TAG.SWITCH);
  static true = new Word('true', TAG.TRUE);
  static false = new Word('false', TAG.FALSE);
  static def = new Word('def', TAG.DEF);
  static invoke = new Word('invoke',TAG.INVOKE);
  static return = new Word('return', TAG.RETURN);

  toString() {
    return this.value;
  }
}

export const RESERVEDWORDS = [
  Word.if,
  Word.else,
  Word.while,
  Word.do,
  Word.switch,
  Word.true,
  Word.false,
  Word.def,
  Word.invoke,
  Word.for,
  Word.return
].map(ele => {
  return ele.toString();
});
