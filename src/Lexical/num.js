import Token from './token.js';
import Tag from './tag.js';
export default class Num extends Token {
	constructor(num) {
		super(Tag.NUM);
		this.value = num;
	}
}
