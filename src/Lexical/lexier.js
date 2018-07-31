import Type from './type.js';
import Word from './word.js';
import Tag from './tag.js';
import Token from './token.js';
import Comment from './comment.js';
import { RESERVEDWORDS } from './word.js';
import { TYPEWORDS } from './type.js';
import Num from './num.js';
import Real from './real.js';
//.怎么处理 中括号怎么处理
//对象怎么处理 new var obbew={} var ff=[]
function isNumbericFn(char) {
  return char.match(/[\d]/);
}

function isLetter(char, isIncludeNum) {
  if (isIncludeNum) {
    return char.match(/[a-z_0-9]/gi);
  }
  return char.match(/[a-z_]/gi);
}

function readLetter(str, i) {
  return str[i];
}

export default function lexier(tokenCollection, str) {
  let start = 0;
  let end = str.length;

  function move() {
    start++;
  }
  function getCurrentChar() {
    return str[start];
  }
  function getLookAheadChar() {
    return str[start + 1];
  }
  while (start != end) {
    let character = getCurrentChar();
    if (
      character == '' ||
      character == '\n' ||
      character == '\r' ||
      character == ' '
    ) {
      move();
      continue;
    }
    if (character == '~') {
      //匹配到下一个字符串	let isEnd = false;
      // tokenCollection.push(new Token(character));
      move();
      let character_letter = getCurrentChar();
      let isNot = character_letter != '~' ? true : false;
      let stringWord = '';
      while (isNot) {
        stringWord += character_letter;
        move();
        character_letter = getCurrentChar();
        isNot = character_letter != '~' ? true : false;
      }
      //move();
      tokenCollection.push(new Token(character));
      tokenCollection.push(new Word(stringWord, Tag.ID));
    }
    if (isLetter(character)) {
      let character_letter = character;
      let isLetterFlag = true;
      let word = '';
      while (isLetterFlag) {
        word += character_letter;
        move();
        character_letter = getCurrentChar();
        isLetterFlag = isLetter(character_letter, true);
      }
      //处理保留字 如if else
      if (RESERVEDWORDS.indexOf(word) > -1) {
        tokenCollection.push(Word[word]);
      } else if (TYPEWORDS.indexOf(word) > -1) {
        //处理类型 如int float string
        tokenCollection.push(Type[word]);
      } else {
        //标识符 如 goods
        tokenCollection.push(new Word(word, Tag.ID));
      }
      continue;
    }
    //处理数字
    if (isNumbericFn(character)) {
      let character_letter = character;
      let isNumberic = true;
      let word = '';
      //不带小数点
      let isReal = false;
      while (isNumberic) {
        word += character_letter;
        move();
        character_letter = getCurrentChar();
        isNumberic = isNumbericFn(character_letter);
        if (!isNumberic && character_letter == '.') {
          //带小数点
          isReal = true;
          //继续进行下去
          isNumberic = true;
        }
      }
      if (isReal) {
        tokenCollection.push(new Real(parseFloat(word)));
      } else {
        tokenCollection.push(new Real(parseInt(word)));
      }
      continue;
    }
    //如何判断 -3 和 8-5 是在语法分析的时候判断么
    //TODO + - += -= ++ *   *=
    switch (character) {
      case '+':
        if (getLookAheadChar() == '+') {
          // ++
          move();
          tokenCollection.push(Word.plus_plus);
        } else if (getLookAheadChar() == '=') {
          // +=
          move();
          tokenCollection.push(Word.plus_equal);
        } else {
          //  +
          tokenCollection.push(new Token(character));
        }
        move();
        break;
      case '*':
        if (getLookAheadChar() == '=') {
          // *=
          move();
          tokenCollection.push(Word.mutil_equal);
        } else {
          //  *
          tokenCollection.push(new Token(character));
        }
        move();
        break;
      case '-':
        if (getLookAheadChar() == '-') {
          // --
          move();
          tokenCollection.push(Word.minus_minus);
        } else if (getLookAheadChar() == '=') {
          // -=
          move();
          tokenCollection.push(Word.minus_equal);
        } else {
          // -
          tokenCollection.push(new Token(character));
        }
        move();
        break;
      case '/':
        //有三种情况 / ----> /= // /*
        if (getLookAheadChar() == '/') {
          let subStr = str.substring(start, str.length);
          //匹配到第一个换行符
          //算出第一个换行符的index,更新start游标，然后把这一段作为一个token输入
          let commentLength = subStr.match(/[\r\n]/).index;
          let newStart = commentLength + start; //
          tokenCollection.push(new Comment(subStr.substring(0, commentLength)));
          start = newStart;
        } else if (getLookAheadChar() == '*') {
          //匹配到第一个*/
          let subStr = str.substring(start, str.length);
          //算出第一个换行符的index,更新start游标，然后把这一段作为一个token输入
          let commentLength = subStr.match(/\*\//).index + 2; //  */ 2个大小
          let newStart = commentLength + start;
          tokenCollection.push(new Comment(subStr.substring(0, commentLength)));
          start = newStart;
        } else if (getLookAheadChar() == '=') {
          // 处理 /=
          move();
          tokenCollection.push(Word.divide_equal);
          move();
        } else {
          tokenCollection.push(Word.divide);
          move();
        }
        break;
      case '>':
        if (getLookAheadChar() == '=') {
          move();
          tokenCollection.push(Word.greater_equal);
        } else {
          tokenCollection.push(Word.greater);
        }
        move();
        break;
      case '<':
        if (getLookAheadChar() == '=') {
          move();
          tokenCollection.push(Word.less_equal);
        } else {
          tokenCollection.push(Word.less);
        }
        move();
        break;
      case '=':
        if (getLookAheadChar() == '=') {
          move();
          tokenCollection.push(Word.equal);
        } else {
          tokenCollection.push(Word.assign);
        }
        move();
        break;
      case '!':
        if (getLookAheadChar() == '=') {
          move();
          tokenCollection.push(Word.not_equal);
        } else {
          tokenCollection.push(Word.not);
        }
        move();
        break;
      case '&':
        if (getLookAheadChar() == '&') {
          move();
          tokenCollection.push(Word.and);
        } else {
          tokenCollection.push(new Token(character));
        }
        move();
        break;
      case '|':
        if (getLookAheadChar() == '|') {
          move();
          tokenCollection.push(Word.or);
        } else {
          tokenCollection.push(new Token(character));
        }
        move();
        break;
      default:
        tokenCollection.push(new Token(character));
        move();
        break;
    }
  }
}
