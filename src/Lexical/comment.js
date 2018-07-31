import Token from './token.js';
import Tag from './tag.js';
export default class Comment extends Token {
	constructor(str) {
		super(Tag.COMMENT);
		this.value = str;
	}
}
