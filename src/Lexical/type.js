import Word from './word.js';
import Tag from './tag.js';
export default class Type extends Word {
	constructor(value, length) {
		super(value, Tag.BASIC);
		this.value = value;
		this.length = length;
	}
	static int = new Type('int', 1);
	static bool = new Type('bool', 1);
	static float = new Type('float', 8);
	static char = new Type('char', 1);
	static string = new Type('string', 8);
	toString() {
		return this.value;
	}
}
export const TYPEWORDS = [Type.string , Type.int, Type.bool, Type.float, Type.char].map(ele => ele.toString());
